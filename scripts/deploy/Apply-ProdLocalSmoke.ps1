param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\\..")).Path,
  [string]$SourceNamespace = "trip-canvas-staging",
  [string]$TargetNamespace = "trip-canvas-prod-local"
)

$ErrorActionPreference = "Stop"

$currentContext = kubectl config current-context 2>$null
if ([string]::IsNullOrWhiteSpace($currentContext)) {
  throw "kubectl current-context is not set. Connect to the target cluster first."
}

kubectl create namespace $TargetNamespace --dry-run=client -o yaml | kubectl apply -f -

$dockerConfig = kubectl get secret ghcr-credentials -n $SourceNamespace -o jsonpath="{.data.\.dockerconfigjson}"
$mapsKey = kubectl get secret trip-canvas-secrets -n $SourceNamespace -o jsonpath="{.data.GOOGLE_MAPS_SERVER_API_KEY}"
$supabaseKey = kubectl get secret trip-canvas-secrets -n $SourceNamespace -o jsonpath="{.data.SUPABASE_SERVICE_ROLE_KEY}"

if ([string]::IsNullOrWhiteSpace($dockerConfig) -or [string]::IsNullOrWhiteSpace($mapsKey) -or [string]::IsNullOrWhiteSpace($supabaseKey)) {
  throw "Failed to read one or more source secrets from namespace '$SourceNamespace'."
}

@"
apiVersion: v1
kind: Secret
metadata:
  name: ghcr-credentials
  namespace: $TargetNamespace
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: $dockerConfig
---
apiVersion: v1
kind: Secret
metadata:
  name: trip-canvas-secrets
  namespace: $TargetNamespace
type: Opaque
data:
  GOOGLE_MAPS_SERVER_API_KEY: $mapsKey
  SUPABASE_SERVICE_ROLE_KEY: $supabaseKey
"@ | kubectl apply -f -

$manifestPath = Join-Path $RepoRoot "argocd\\trip-canvas-prod-local.yaml"
kubectl apply -f $manifestPath

kubectl wait --for=condition=available deployment/trip-canvas -n $TargetNamespace --timeout=180s

Write-Host "Prod-local smoke deploy is available in namespace '$TargetNamespace' for context '$currentContext'."
