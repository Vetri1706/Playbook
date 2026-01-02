# Installation Script for Windows
# Run this in PowerShell after creating and activating virtual environment

Write-Host "================================" -ForegroundColor Cyan
Write-Host "PDF Backend Installation Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check Python version
Write-Host "Checking Python version..." -ForegroundColor Yellow
$pythonVersion = python --version
Write-Host "Found: $pythonVersion" -ForegroundColor Green

if ($pythonVersion -match "3\.13") {
    Write-Host ""
    Write-Host "WARNING: Python 3.13 detected!" -ForegroundColor Red
    Write-Host "PyMuPDF doesn't have pre-built wheels for Python 3.13 yet." -ForegroundColor Red
    Write-Host ""
    Write-Host "RECOMMENDED SOLUTIONS:" -ForegroundColor Yellow
    Write-Host "1. Install Python 3.11 or 3.12 from python.org" -ForegroundColor White
    Write-Host "2. Use conda: conda create -n dt-backend python=3.11" -ForegroundColor White
    Write-Host ""
    Write-Host "See INSTALL_NOTES.txt for detailed instructions." -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Upgrade pip
Write-Host ""
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip setuptools wheel

# Try to install PyMuPDF first (this is the tricky one)
Write-Host ""
Write-Host "Installing PyMuPDF (this may take a moment)..." -ForegroundColor Yellow

$pymupdfInstalled = $false
try {
    pip install PyMuPDF==1.23.8 --only-binary :all: 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $pymupdfInstalled = $true
        Write-Host "✓ PyMuPDF installed successfully!" -ForegroundColor Green
    }
}
catch {
    Write-Host "✗ PyMuPDF installation failed" -ForegroundColor Red
}

if (-not $pymupdfInstalled) {
    Write-Host ""
    Write-Host "Attempting alternative PyMuPDF installation..." -ForegroundColor Yellow
    try {
        pip install PyMuPDF 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            $pymupdfInstalled = $true
            Write-Host "✓ PyMuPDF installed successfully!" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "✗ Alternative installation also failed" -ForegroundColor Red
    }
}

if (-not $pymupdfInstalled) {
    Write-Host ""
    Write-Host "ERROR: Could not install PyMuPDF" -ForegroundColor Red
    Write-Host "Please see INSTALL_NOTES.txt for solutions" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Installing other dependencies anyway..." -ForegroundColor Yellow
    pip install -r requirements-minimal.txt
    Write-Host ""
    Write-Host "Partial installation complete (without PyMuPDF)" -ForegroundColor Yellow
    exit
}

# Install remaining dependencies
Write-Host ""
Write-Host "Installing remaining dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Verify installations
Write-Host ""
Write-Host "Verifying installations..." -ForegroundColor Yellow

$modules = @("flask", "sqlalchemy", "jwt", "fitz")
$allInstalled = $true

foreach ($module in $modules) {
    $testCommand = "python -c `"import $module`" 2>&1"
    $result = Invoke-Expression $testCommand
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ $module" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ $module (failed)" -ForegroundColor Red
        $allInstalled = $false
    }
}

Write-Host ""
if ($allInstalled) {
    Write-Host "================================" -ForegroundColor Green
    Write-Host "✓ Installation Complete!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Copy .env.example to .env and configure it" -ForegroundColor White
    Write-Host "2. Run: python init_db.py" -ForegroundColor White
    Write-Host "3. Run: python app.py" -ForegroundColor White
}
else {
    Write-Host "================================" -ForegroundColor Yellow
    Write-Host "Installation completed with issues" -ForegroundColor Yellow
    Write-Host "================================" -ForegroundColor Yellow
    Write-Host "Some modules failed to install. See INSTALL_NOTES.txt" -ForegroundColor White
}
