param(
    [int]$Port = 4173
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$server = $null

try {
    # GitHub Actions 使用 Linux runner；不要使用 Windows 專用的 WindowStyle 參數。
    $server = Start-Process -FilePath 'python' -ArgumentList @('-m', 'http.server', $Port, '--bind', '127.0.0.1') -WorkingDirectory $root -PassThru
    $baseUrl = "http://127.0.0.1:$Port"

    $ready = $false
    for ($attempt = 0; $attempt -lt 20; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri "$baseUrl/index.html" -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                $ready = $true
                break
            }
        } catch {
            Start-Sleep -Milliseconds 250
        }
    }
    if (-not $ready) {
        throw "Local HTTP server did not become ready on port $Port."
    }

    $pages = @(
        'index.html',
        'geo-ai/index.html',
        'precision-worktime/index.html',
        'solar-report/index.html',
        '404.html'
    )

    foreach ($page in $pages) {
        $response = Invoke-WebRequest -Uri "$baseUrl/$page" -UseBasicParsing
        if ($response.StatusCode -ne 200) {
            throw "$page returned HTTP $($response.StatusCode)."
        }
        if ($response.Content -notmatch '<title>[^<]+</title>') {
            throw "$page is missing a usable title."
        }
        Write-Host "OK $page ($($response.Content.Length) bytes)"
    }

    $assets = @(
        'assets/background/hero-eggroll-cookie-2p5d.webp',
        'geo-ai/assets/images/geo-cover-ai-search.webp',
        'precision-worktime/assets/images/cover-worktime-factory.webp',
        'solar-report/index.html',
        'site.webmanifest',
        'robots.txt',
        'sitemap.xml'
    )

    foreach ($asset in $assets) {
        $response = Invoke-WebRequest -Uri "$baseUrl/$asset" -UseBasicParsing
        if ($response.StatusCode -ne 200) {
            throw "$asset returned HTTP $($response.StatusCode)."
        }
        Write-Host "OK $asset"
    }

    Write-Host 'Runtime smoke test passed.'
} finally {
    if ($null -ne $server) {
        Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
    }
}
