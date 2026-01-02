# Start the PDF Backend Server
# This script optionally activates a virtual environment and starts the Flask server.

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " PDF Generation Backend Server" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to this backend directory (where app.py lives)
$backendDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $backendDir

# Activate virtual environment (if present)
if (Test-Path ".\.venv\Scripts\Activate.ps1") {
  Write-Host "Activating local virtual environment..." -ForegroundColor Yellow
  .\.venv\Scripts\Activate.ps1
}
else {
  Write-Host "No local venv found; using system Python." -ForegroundColor Yellow
}

# Check Python version
$pythonVersion = python --version
Write-Host "Using: $pythonVersion" -ForegroundColor Green
Write-Host ""

# Start the server
Write-Host "Starting Flask server..." -ForegroundColor Yellow
Write-Host "Server will be available at: http://localhost:5000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

python app.py
