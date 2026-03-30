param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\\..")).Path
)

$ErrorActionPreference = "Stop"

$currentContext = kubectl config current-context 2>$null
if ([string]::IsNullOrWhiteSpace($currentContext)) {
  throw "kubectl current-context is not set. Connect to the target cluster first."
}

$secretName = kubectl get secret github-pr-generator-token -n argocd -o name 2>$null
if ([string]::IsNullOrWhiteSpace($secretName)) {
  throw "Missing secret argocd/github-pr-generator-token. Run Apply-PreviewTokenSecret.ps1 first."
}

$appSetPath = Join-Path $RepoRoot "argocd\\trip-canvas-preview-applicationset.yaml"

kubectl apply -f $appSetPath

Write-Host "Preview ApplicationSet applied in context '$currentContext'."
