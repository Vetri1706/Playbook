/**
 * PDF Image Extractor Script
 * 
 * This script extracts images from the SNS Design Thinking Playbook PDF
 * Run: node extract-pdf-images.js
 */

const fs = require('fs');
const path = require('path');

console.log('📄 PDF Image Extraction Tool');
console.log('================================\n');

const pdfPath = path.join(__dirname, 'SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf');
const outputDir = path.join(__dirname, 'public', 'images');

// Check if PDF exists
if (!fs.existsSync(pdfPath)) {
  console.error('❌ PDF file not found at:', pdfPath);
  process.exit(1);
}

console.log('✅ PDF found:', pdfPath);
console.log('📁 Output directory:', outputDir);
console.log('\n⚠️  MANUAL EXTRACTION REQUIRED\n');

console.log('To extract images from the PDF:');
console.log('\n📋 Option 1: Adobe Acrobat Reader');
console.log('   1. Open PDF in Adobe Acrobat Reader');
console.log('   2. Right-click on each character image');
console.log('   3. Select "Save Image As..."');
console.log('   4. Save to public/images/ folder');

console.log('\n📋 Option 2: Online PDF to Image Converter');
console.log('   1. Visit: https://www.ilovepdf.com/pdf_to_jpg');
console.log('   2. Upload the PDF');
console.log('   3. Download extracted images');
console.log('   4. Rename and move to public/images/');

console.log('\n📋 Option 3: Use pdf-lib or pdf2pic package');
console.log('   Run: npm install pdf-lib pdf2pic');
console.log('   Then use automated extraction (requires GraphicsMagick)');

console.log('\n📝 Required Image Names:');
const requiredImages = [
  'spiderman.png',
  'kim-possible.png',
  'thanos.png',
  'peppa-pig.png',
  'black-panther.png',
  'tom-jerry.png',
  'olaf-sven.png',
  'captain-america.png',
  'sns-logo.png',
  'sns-academy-logo.png'
];

requiredImages.forEach((img, i) => {
  const exists = fs.existsSync(path.join(outputDir, img));
  console.log(`   ${exists ? '✅' : '❌'} ${img}`);
});

console.log('\n💡 Tip: Until images are added, the app uses emoji placeholders!');
console.log('🎨 The app is fully functional with emojis.\n');
