param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\\..")).Path,
  [switch]$SkipPlaceholderCheck
)

$ErrorActionPreference = "Stop"

$currentContext = kubectl config current-context 2>$null
if ([string]::IsNullOrWhiteSpace($currentContext)) {
  throw "kubectl current-context is not set. Connect to the target cluster first."
}

$configMapPath = Join-Path $RepoRoot "deploy\\overlays\\prod\\configmap.yaml"
$ingressPath = Join-Path $RepoRoot "deploy\\overlays\\prod\\ingress.yaml"
$kustomizationPath = Join-Path $RepoRoot "deploy\\overlays\\prod\\kustomization.yaml"
$appPath = Join-Path $RepoRoot "argocd\\trip-canvas-prod.yaml"

if (-not $SkipPlaceholderCheck) {
  $configMapRaw = Get-Content -Path $configMapPath -Raw
  $ingressRaw = Get-Content -Path $ingressPath -Raw
  $kustomizationRaw = Get-Content -Path $kustomizationPath -Raw

  if ($configMapRaw -match "replace-me" -or $configMapRaw -match "example\\.com" -or $ingressRaw -match "example\\.com" -or $kustomizationRaw -match "release-placeholder") {
    throw "Production overlay still contains placeholder values. Update configmap.yaml, ingress.yaml, and image tag before applying Argo CD."
  }
}

kubectl apply -f $appPath

Write-Host "Argo CD production application applied in context '$currentContext'."
