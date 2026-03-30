param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\\..")).Path,
  [switch]$SkipPlaceholderCheck
)

$ErrorActionPreference = "Stop"

$currentContext = kubectl config current-context 2>$null
if ([string]::IsNullOrWhiteSpace($currentContext)) {
  throw "kubectl current-context is not set. Connect to the target cluster first."
}

$configMapPath = Join-Path $RepoRoot "deploy\\overlays\\staging\\configmap.yaml"
$ingressPath = Join-Path $RepoRoot "deploy\\overlays\\staging\\ingress.yaml"
$appPath = Join-Path $RepoRoot "argocd\\trip-canvas-staging.yaml"

if (-not $SkipPlaceholderCheck) {
  $configMapRaw = Get-Content -Path $configMapPath -Raw
  $ingressRaw = Get-Content -Path $ingressPath -Raw

  if ($configMapRaw -match "replace-me" -or $configMapRaw -match "example\\.com" -or $ingressRaw -match "example\\.com") {
    throw "Staging overlay still contains placeholder values. Update configmap.yaml and ingress.yaml before applying Argo CD."
  }
}

kubectl apply -f $appPath

Write-Host "Argo CD staging application applied in context '$currentContext'."
