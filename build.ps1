$ErrorActionPreference = "Stop"
# BUILD: regenera los archivos minificados desde las fuentes editables.
# Uso: powershell -File build.ps1   (requiere internet la primera vez, npx descarga todo)
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $dir

Write-Output "== Minificando JS =="
npx --yes terser js/main.js -c -m -o js/main.min.js
if ($LASTEXITCODE -ne 0) { throw "terser fallo" }

Write-Output "== Minificando CSS =="
npx --yes clean-css-cli -O1 css/style.css -o css/style.min.css
if ($LASTEXITCODE -ne 0) { throw "clean-css fallo" }

Pop-Location
foreach ($f in @("js\main.js", "js\main.min.js", "css\style.css", "css\style.min.css")) {
  $kb = [math]::Round((Get-Item (Join-Path $dir $f)).Length / 1kb, 1)
  Write-Output ("{0} -> {1} KB" -f $f, $kb)
}
Write-Output "BUILD OK"
