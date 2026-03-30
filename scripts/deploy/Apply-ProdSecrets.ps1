param(
  [string]$Namespace = "trip-canvas-prod",
  [string]$GhcrUsername = $env:GHCR_USERNAME,
  [string]$GhcrToken = $env:GHCR_TOKEN,
  [string]$SupabaseServiceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY,
  [string]$GoogleMapsServerApiKey = $env:GOOGLE_MAPS_SERVER_API_KEY
)

$ErrorActionPreference = "Stop"

function Assert-Value {
  param(
    [string]$Name,
    [string]$Value
  )

  if ([string]::IsNullOrWhiteSpace($Value)) {
    throw "Missing required value: $Name"
  }
}

$currentContext = kubectl config current-context 2>$null
if ([string]::IsNullOrWhiteSpace($currentContext)) {
  throw "kubectl current-context is not set. Connect to the target cluster first."
}

Assert-Value -Name "GHCR_USERNAME" -Value $GhcrUsername
Assert-Value -Name "GHCR_TOKEN" -Value $GhcrToken
Assert-Value -Name "SUPABASE_SERVICE_ROLE_KEY" -Value $SupabaseServiceRoleKey
Assert-Value -Name "GOOGLE_MAPS_SERVER_API_KEY" -Value $GoogleMapsServerApiKey

kubectl create namespace $Namespace --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret docker-registry ghcr-credentials `
  --namespace $Namespace `
  --docker-server ghcr.io `
  --docker-username $GhcrUsername `
  --docker-password $GhcrToken `
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic trip-canvas-secrets `
  --namespace $Namespace `
  --from-literal=SUPABASE_SERVICE_ROLE_KEY=$SupabaseServiceRoleKey `
  --from-literal=GOOGLE_MAPS_SERVER_API_KEY=$GoogleMapsServerApiKey `
  --dry-run=client -o yaml | kubectl apply -f -

Write-Host "Production secrets applied to namespace '$Namespace' in context '$currentContext'."
