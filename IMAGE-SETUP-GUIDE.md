# 🎨 Image Organization Guide

## Quick Steps to Add Images

### Step 1: Open Both Folders

1. Open `ilovepdf_images-extracted\` folder
2. Open `public\images\` folder
3. Place them side-by-side in Windows Explorer

### Step 2: Identify & Copy Images

Look through the extracted images and find these characters:

#### 🏢 **Logos** (Look for text-based images)

- **SNS Institutions Logo** → Rename to: `sns-logo.jpg`
- **SNS Academy Logo** → Rename to: `sns-academy-logo.jpg`

#### 🦸 **Superheroes** (Look for character illustrations)

1. **🕷️ Spider-Man** (red and blue character)

   - Rename to: `spiderman.jpg`
   - Found on: Page 1/Landing page

2. **🦸‍♀️ Kim Possible** (orange/brown character, female)

   - Rename to: `kim-possible.jpg`
   - Found on: Page 2

3. **👾 Thanos** (purple character, large figure)

   - Rename to: `thanos.jpg`
   - Found on: Page 3-4

4. **🐷 Peppa Pig** (pink pig character)

   - Rename to: `peppa-pig.jpg`
   - Found on: Page 3-4

5. **🐾 Black Panther** (black superhero with mask)

   - Rename to: `black-panther.jpg`
   - Found on: Page 5-6

6. **🐱🐭 Tom & Jerry** (cat and mouse)

   - Rename to: `tom-jerry.jpg`
   - Found on: Page 5-6

7. **⛄ Olaf & Sven** (snowman and reindeer from Frozen)

   - Rename to: `olaf-sven.jpg`
   - Found on: Page 7-8

8. **🛡️ Captain America** (shield or character in blue/red/white)
   - Rename to: `captain-america.jpg`
   - Found on: Page 9-10

---

## ⚡ Quick Method

### Option A: Drag and Drop

1. Open `ilovepdf_images-extracted\` in one window
2. Open `public\images\` in another window
3. Drag each identified image to `public\images\`
4. Right-click → Rename to the correct name

### Option B: Use the Script

1. Run `analyze-images.js` to see which images are on which pages
2. Run `copy-images.bat` for template commands
3. Modify the commands with actual image numbers
4. Run the commands

### Option C: Manual Copy

```cmd
:: Example - adjust image numbers as needed
copy ilovepdf_images-extracted\img26.jpg public\images\spiderman.jpg
copy ilovepdf_images-extracted\img40.jpg public\images\kim-possible.jpg
```

---

## 🔍 Tips for Identifying Images

### File Size Hints:

- **Logos**: Usually smaller files (10-50 KB)
- **Characters**: Medium to large files (50-300 KB)
- **Background elements**: Very small files (< 10 KB)

### Visual Hints:

- Look at the actual image preview in Windows Explorer
- Characters are usually colorful and stand out
- Logos often have text/school branding

### Page Order:

The PDF has 12 pages, images are extracted in order:

- **img23-img38**: Page 1 (Landing - Spider-Man + logos)
- **img39-img52**: Page 2 (Step 1 - Kim Possible)
- **img53-img82**: Page 3-4 (Step 2 - Thanos + Peppa)
- **img83-img125**: Page 5-6 (Step 3 - Black Panther + Tom/Jerry)
- **img126-img180**: Page 7-8 (Step 4 - Olaf)
- **img181-end**: Page 9-12 (Step 5 - Captain America + extras)

---

## ✅ Verification

After copying, run this to check:

```bash
node analyze-images.js
```

It will show which images are found in `public\images\`

---

## 🎉 Final Step

Once images are copied, the app will **automatically use them**!

Just run:

```bash
npm run dev
```

Visit http://localhost:3000 and enjoy your hero-themed playbook! 🚀

---

## 📝 Notes

- **JPG format works perfectly** - no need to convert to PNG
- **Both formats supported** - app checks for .png first, then .jpg
- **Emoji fallback** - if image not found, shows emoji instead
- **Case sensitive** - use lowercase names exactly as shown above
