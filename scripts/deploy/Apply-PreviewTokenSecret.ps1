param(
  [string]$Namespace = "argocd",
  [string]$Token = $(if ($env:GITHUB_PR_GENERATOR_TOKEN) { $env:GITHUB_PR_GENERATOR_TOKEN } else { $env:GITHUB_TOKEN_DESKTOP })
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Token)) {
  throw "Missing required value: GITHUB_PR_GENERATOR_TOKEN (or GITHUB_TOKEN_DESKTOP fallback)"
}

$currentContext = kubectl config current-context 2>$null
if ([string]::IsNullOrWhiteSpace($currentContext)) {
  throw "kubectl current-context is not set. Connect to the target cluster first."
}

kubectl create secret generic github-pr-generator-token `
  --namespace $Namespace `
  --from-literal=token=$Token `
  --dry-run=client -o yaml | kubectl apply -f -

Write-Host "Preview generator token secret applied in namespace '$Namespace' for context '$currentContext'."
