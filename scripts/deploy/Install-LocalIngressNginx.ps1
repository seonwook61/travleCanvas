param(
  [string]$ManifestUrl = "https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.15.1/deploy/static/provider/cloud/deploy.yaml"
)

$ErrorActionPreference = "Stop"

$currentContext = kubectl config current-context 2>$null
if ([string]::IsNullOrWhiteSpace($currentContext)) {
  throw "kubectl current-context is not set. Connect to the target cluster first."
}

kubectl apply -f $ManifestUrl
kubectl wait --namespace ingress-nginx --for=condition=available deployment/ingress-nginx-controller --timeout=240s

Write-Host "Local ingress-nginx controller is ready in context '$currentContext'."
