# Quick Start Guide

## Installation (Windows)

1. **Install Python 3.9 - 3.12** (Python 3.13 not fully supported yet)
   - Download from python.org (recommend Python 3.11 or 3.12)
   - Make sure to check "Add Python to PATH"
   - Verify: `python --version`

2. **Open PowerShell in the backend folder**
   ```powershell
   cd "d:\dt playbook\design-thinking-playbook-website\backend"
   ```

3. **Create virtual environment** (HIGHLY RECOMMENDED)
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
   
   If you get execution policy error, run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

4. **Upgrade pip first**
   ```powershell
   python -m pip install --upgrade pip
   ```

5. **Install dependencies** (this may take a few minutes)
   ```powershell
   pip install --upgrade pip setuptools wheel
   pip install -r requirements.txt
   ```
   
   **If PyMuPDF installation fails**, try:
   ```powershell
   pip install PyMuPDF --only-binary :all:
   ```

5. **Create .env file**
   ```powershell
   copy .env.example .env
   ```
   Edit `.env` and set the correct `PDF_TEMPLATE_PATH`

6. **Initialize database**
   ```powershell
   python init_db.py
   ```

7. **Run the server**
   ```powershell
   python app.py
   ```

Server will start at: http://localhost:5000

## Test the API

1. **Health check**
   ```powershell
   curl http://localhost:5000/api/health
   ```

2. **Test with examples**
   ```powershell
   python examples/usage_examples.py
   ```

## Common Issues

### Issue: "ModuleNotFoundError: No module named 'flask'"
**Solution**: 
1. Make sure virtual environment is activated: `.\venv\Scripts\Activate.ps1`
2. Install requirements: `pip install -r requirements.txt`

### Issue: PyMuPDF installation fails (Visual Studio error)
**Solution**: Your Python version (3.13) is too new. PyMuPDF doesn't have pre-built wheels for Python 3.13 yet.

**FIX OPTIONS:**

**Option 1 (RECOMMENDED): Use Python 3.11 or 3.12**
```powershell
# Download and install Python 3.11 or 3.12 from python.org
# Then create new venv:
py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Option 2: Install Visual Studio Build Tools** (if you want to keep Python 3.13)
```powershell
# Download from: https://visualstudio.microsoft.com/downloads/
# Install "Desktop development with C++" workload
# Then retry: pip install -r requirements.txt
```

**Option 3: Use conda/mamba** (easiest for complex packages)
```powershell
# Install miniforge from: https://github.com/conda-forge/miniforge
conda create -n dt-backend python=3.11
conda activate dt-backend
pip install -r requirements.txt
```

### Issue: "PDF template not found"
**Solution**: Update `PDF_TEMPLATE_PATH` in `.env` to point to your PDF file

### Issue: "Permission denied" or "Execution Policy"
**Solution**: 
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Next Steps

1. Read the full [README.md](README.md)
2. Calibrate coordinates using `python utils/pdf_calibrator.py`
3. Integrate with your frontend application
4. Test PDF generation with real user data

## API Testing with PowerShell

```powershell
# Generate PDF (requires token)
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
}

$body = @{
    project_id = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/generate-pdf" -Method Post -Headers $headers -Body $body
```
