@echo off
setlocal
cd /d "%~dp0"

echo ================================================
echo   FUYISHAN Interactive Website
echo ================================================
echo Starting website, please wait...
echo.

REM Start the server in the background and open the browser automatically.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
if errorlevel 1 (
  echo.
  echo Website startup failed. Please check that Python is installed.
  echo Open manually: http://127.0.0.1:4173/index.html
  pause
)
