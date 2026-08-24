param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = "Stop"
$failures = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()

function Add-Failure([string]$Message) { $script:failures.Add($Message) }
function Add-Warning([string]$Message) { $script:warnings.Add($Message) }

$sourceFiles = Get-ChildItem -LiteralPath $ProjectRoot -Recurse -File |
  Where-Object { $_.Extension -in '.html', '.css' } |
  Where-Object { $_.FullName -notmatch '\\node_modules\\|\\dist\\' }

$htmlFiles = $sourceFiles | Where-Object Extension -eq '.html'
$cssFiles = $sourceFiles | Where-Object Extension -eq '.css'

$htmlFiles = $htmlFiles |
  Where-Object { $_.FullName -notmatch '\\node_modules\\|\\dist\\' }

$mainHtml = Join-Path $ProjectRoot 'index.html'
if (Test-Path -LiteralPath $mainHtml -PathType Leaf) {
  $mainContent = Get-Content -LiteralPath $mainHtml -Raw
  $sections = [regex]::Matches($mainContent, '<section\b[^>]*data-section="([^"]+)"[^>]*>')
  foreach ($section in $sections) {
    if ($section.Value -notmatch '\bdata-section-name(?:\s|=|>)') {
      Add-Failure "index.html section '$($section.Groups[1].Value)' is missing data-section-name"
    }
  }

  foreach ($counter in [regex]::Matches($mainContent, '<[^>]*data-counter[^>]*>')) {
    if ($counter.Value -notmatch '\bdata-target="[^"]+"') {
      Add-Failure "index.html counter is missing data-target: $($counter.Value)"
    }
  }
}

foreach ($file in $sourceFiles) {
  $content = Get-Content -LiteralPath $file.FullName -Raw
  $relativeFile = $file.FullName.Substring($ProjectRoot.Length + 1)

  foreach ($match in [regex]::Matches($content, '(?:src|href)\s*=\s*["'']([^"'']+)["'']|url\(["'']?([^\)"'']+)["'']?\)')) {
    $reference = if ($match.Groups[1].Success) { $match.Groups[1].Value } else { $match.Groups[2].Value }
    if ($reference -match '^(https?:|data:|#|mailto:|tel:|javascript:)') { continue }
    $reference = $reference.Split('?')[0].Split('#')[0]
    if ([string]::IsNullOrWhiteSpace($reference)) { continue }

    $candidate = Join-Path $file.DirectoryName ($reference -replace '/', '\\')
    if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
      Add-Failure "$relativeFile references missing resource: $reference"
    }
  }
}

$assetFiles = Get-ChildItem -LiteralPath (Join-Path $ProjectRoot 'assets') -Recurse -File -Force -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -ne '.gitkeep' }
$duplicateGroups = $assetFiles | Get-FileHash -Algorithm SHA256 | Group-Object Hash | Where-Object Count -gt 1
foreach ($group in $duplicateGroups) {
  $names = ($group.Group | ForEach-Object { $_.Path.Substring($ProjectRoot.Length + 1) }) -join ', '
  Add-Warning "duplicate asset content: $names"
}

Write-Host "Project: $ProjectRoot"
Write-Host "HTML files checked: $($htmlFiles.Count)"
Write-Host "Assets checked: $($assetFiles.Count)"
if ($warnings.Count) {
  Write-Host "Warnings: $($warnings.Count)"
  $warnings | ForEach-Object { Write-Host "  [WARN] $_" }
}
if ($failures.Count) {
  Write-Host "Failures: $($failures.Count)"
  $failures | ForEach-Object { Write-Host "  [FAIL] $_" }
  exit 1
}

Write-Host "PASS: all local HTML resource references resolve."
