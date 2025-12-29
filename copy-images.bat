@echo off
echo ========================================
echo   SNS Playbook Image Copy Helper
echo ========================================
echo.
echo This script helps you copy and rename images
echo from the extracted folder to public\images
echo.
echo INSTRUCTIONS:
echo 1. Look at images in: ilovepdf_images-extracted\
echo 2. Identify which image is which character
echo 3. Run commands below (replace imgXXX.jpg with actual filename)
echo.
echo ----------------------------------------
echo Example Commands:
echo ----------------------------------------
echo.
echo :: For logos (usually on first page)
echo copy ilovepdf_images-extracted\img23.jpg public\images\sns-logo.jpg
echo copy ilovepdf_images-extracted\img24.jpg public\images\sns-academy-logo.jpg
echo.
echo :: For Spider-Man (landing page)
echo copy ilovepdf_images-extracted\img26.jpg public\images\spiderman.jpg
echo.
echo :: For Kim Possible (Step 1)
echo copy ilovepdf_images-extracted\img40.jpg public\images\kim-possible.jpg
echo.
echo :: For Thanos (Step 2)
echo copy ilovepdf_images-extracted\img50.jpg public\images\thanos.jpg
echo.
echo :: For Peppa Pig (Step 2)
echo copy ilovepdf_images-extracted\img51.jpg public\images\peppa-pig.jpg
echo.
echo :: For Black Panther (Step 3)
echo copy ilovepdf_images-extracted\img79.jpg public\images\black-panther.jpg
echo.
echo :: For Tom and Jerry (Step 3)
echo copy ilovepdf_images-extracted\img80.jpg public\images\tom-jerry.jpg
echo.
echo :: For Olaf and Sven (Step 4)
echo copy ilovepdf_images-extracted\img102.jpg public\images\olaf-sven.jpg
echo.
echo :: For Captain America (Step 5)
echo copy ilovepdf_images-extracted\img122.jpg public\images\captain-america.jpg
echo.
echo ----------------------------------------
echo.
echo TIP: Open both folders side-by-side:
echo   - ilovepdf_images-extracted\
echo   - public\images\
echo.
echo Then drag and drop images while renaming them!
echo.
echo Press any key to open the extracted images folder...
pause >nul
start explorer ilovepdf_images-extracted
echo.
echo Done! After copying, run: npm run dev
echo.
pause
