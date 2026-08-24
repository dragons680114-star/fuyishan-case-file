$ErrorActionPreference = "Stop"

# Resolve the project folder from this script so it works from any current directory.
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 4173
$url = "http://127.0.0.1:$port/index.html"

# Reuse an existing local server instead of starting a duplicate process.
$existingConnection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($existingConnection) {
  Start-Process $url
  Write-Host "Website is already running: $url"
  exit 0
}

# Prefer python.exe and fall back to the Python Launcher.
$python = Get-Command python.exe -ErrorAction SilentlyContinue
if (-not $python) {
  $python = Get-Command py.exe -ErrorAction SilentlyContinue
}

if (-not $python) {
  Write-Error "Python was not found. Please install Python or use VS Code Live Server."
  exit 1
}

# Start the HTTP server as a separate process rooted at this website folder.
Start-Process `
  -FilePath $python.Source `
  -ArgumentList @("-m", "http.server", "$port", "--bind", "127.0.0.1") `
  -WorkingDirectory $projectRoot `
  -WindowStyle Normal | Out-Null

Start-Sleep -Milliseconds 900

try {
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
  if ($response.StatusCode -ne 200) {
    throw "HTTP server returned status $($response.StatusCode)"
  }
} catch {
  Write-Error "HTTP server did not start successfully: $($_.Exception.Message)"
  exit 1
}

Start-Process $url
Write-Host "Website started: $url"
