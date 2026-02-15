param(
  [int]$Port = 8080
)

$ErrorActionPreference = 'Stop'

Write-Host "Starting Dino-pedia local server on port $Port..."
Write-Host "Open: http://localhost:$Port"

if (Get-Command python -ErrorAction SilentlyContinue) {
  python -m http.server $Port --bind 0.0.0.0
  exit $LASTEXITCODE
}

if (Get-Command py -ErrorAction SilentlyContinue) {
  py -3 -m http.server $Port --bind 0.0.0.0
  exit $LASTEXITCODE
}

Write-Error "Python is not installed. Install Python 3, then run this script again."
