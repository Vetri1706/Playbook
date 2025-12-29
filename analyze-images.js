const fs = require('fs');
const path = require('path');

console.log('🎨 SNS Playbook Image Analyzer\n');

const sourceDir = './ilovepdf_images-extracted';
const targetDir = './public/images';

// Get all images sorted by name
const images = fs.readdirSync(sourceDir)
  .filter(file => file.endsWith('.jpg'))
  .sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''));
    const numB = parseInt(b.replace(/\D/g, ''));
    return numA - numB;
  });

console.log(`📊 Found ${images.length} images\n`);

// Group images by likely page (every ~5 images is usually 1 PDF page)
console.log('📄 Likely Page Groupings:\n');

const pageGroups = {
  'Page 1 (Landing - Spider-Man + Logos)': images.slice(0, 6),
  'Page 2 (Step 1 - Kim Possible)': images.slice(6, 11),
  'Page 3 (Step 2 - Thanos + Peppa)': images.slice(11, 16),
  'Page 4 (Step 3 - Black Panther + Tom/Jerry)': images.slice(16, 21),
  'Page 5 (Step 4 - Olaf + Sven)': images.slice(21, 26),
  'Page 6 (Step 5 - Captain America)': images.slice(26, 31),
};

Object.entries(pageGroups).forEach(([page, imgs]) => {
  console.log(`${page}:`);
  imgs.forEach(img => {
    const stats = fs.statSync(path.join(sourceDir, img));
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`  - ${img} (${sizeKB} KB)`);
  });
  console.log('');
});

console.log('\n🎯 Character Mapping Guide:\n');
console.log('Based on PDF structure, likely mappings:');
console.log('');
console.log('📌 LOGOS (usually larger files on Page 1):');
console.log('   → sns-logo.png');
console.log('   → sns-academy-logo.png');
console.log('');
console.log('📌 CHARACTERS:');
console.log('   Page 1: → spiderman.png');
console.log('   Page 2: → kim-possible.png');
console.log('   Page 3: → thanos.png, peppa-pig.png');
console.log('   Page 4: → black-panther.png, tom-jerry.png');
console.log('   Page 5: → olaf-sven.png');
console.log('   Page 6: → captain-america.png');
console.log('');

console.log('💡 Next Steps:\n');
console.log('1. Open Windows Explorer: ilovepdf_images-extracted\\');
console.log('2. Preview each image to identify characters');
console.log('3. Copy & rename to public\\images\\ folder');
console.log('4. Use these exact filenames:');
console.log('   - spiderman.png');
console.log('   - kim-possible.png');
console.log('   - thanos.png');
console.log('   - peppa-pig.png');
console.log('   - black-panther.png');
console.log('   - tom-jerry.png');
console.log('   - olaf-sven.png');
console.log('   - captain-america.png');
console.log('   - sns-logo.png');
console.log('   - sns-academy-logo.png');
console.log('');
console.log('✨ JPG files work fine! PNG conversion is optional.\n');

// Check which images already exist
console.log('📋 Current Status:\n');
const requiredImages = [
  'spiderman.png', 'spiderman.jpg',
  'kim-possible.png', 'kim-possible.jpg',
  'thanos.png', 'thanos.jpg',
  'peppa-pig.png', 'peppa-pig.jpg',
  'black-panther.png', 'black-panther.jpg',
  'tom-jerry.png', 'tom-jerry.jpg',
  'olaf-sven.png', 'olaf-sven.jpg',
  'captain-america.png', 'captain-america.jpg',
  'sns-logo.png', 'sns-logo.jpg',
  'sns-academy-logo.png', 'sns-academy-logo.jpg'
];

const existing = requiredImages.filter(img => 
  fs.existsSync(path.join(targetDir, img))
);

if (existing.length > 0) {
  console.log('✅ Already in public/images/:');
  existing.forEach(img => console.log(`   - ${img}`));
} else {
  console.log('❌ No images found in public/images/ yet');
}
console.log('');
