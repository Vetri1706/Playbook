# Image Organization Script for SNS Playbook
# This script helps identify which extracted images are the hero characters

Write-Host "🎨 SNS Playbook Image Organizer" -ForegroundColor Cyan
Write-Host "================================`n"

$sourceDir = "ilovepdf_images-extracted"
$targetDir = "public\images"

# Ensure target directory exists
if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    Write-Host "✅ Created $targetDir directory`n" -ForegroundColor Green
}

# Get all images
$images = Get-ChildItem -Path $sourceDir -Filter "*.jpg" | Sort-Object Name

Write-Host "📊 Found $($images.Count) images in extracted folder`n"

# Images we need to identify
$neededImages = @(
    "spiderman.png",
    "kim-possible.png",
    "thanos.png",
    "peppa-pig.png",
    "black-panther.png",
    "tom-jerry.png",
    "olaf-sven.png",
    "captain-america.png",
    "sns-logo.png",
    "sns-academy-logo.png"
)

Write-Host "🎯 Images we need to find:" -ForegroundColor Yellow
$neededImages | ForEach-Object { Write-Host "   - $_" }

Write-Host "`n📝 Manual Steps:" -ForegroundColor Cyan
Write-Host "   1. Open the extracted folder: $sourceDir"
Write-Host "   2. Look at each image to identify characters/logos"
Write-Host "   3. Copy and rename them to $targetDir with the names above"
Write-Host "   4. Convert JPG to PNG for transparency (optional)"

Write-Host "`n💡 Quick Preview Tips:" -ForegroundColor Green
Write-Host "   - Page 1: Landing page (Spider-Man + logos)"
Write-Host "   - Page 2-3: Step 1 (Kim Possible)"
Write-Host "   - Page 4-5: Step 2 (Thanos + Peppa Pig)"
Write-Host "   - Page 6-7: Step 3 (Black Panther + Tom & Jerry)"
Write-Host "   - Page 8-9: Step 4 (Olaf + Sven)"
Write-Host "   - Page 10-11: Step 5 (Captain America)"

Write-Host "`n🔍 Opening extracted images folder..." -ForegroundColor Cyan
Start-Process explorer.exe -ArgumentList (Resolve-Path $sourceDir)

Write-Host "`n✨ After organizing, the app will automatically use the images!" -ForegroundColor Green
