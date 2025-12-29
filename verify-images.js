const fs = require('fs');
const path = require('path');

console.log('🎨 SNS Playbook - Image Verification\n');
console.log('=====================================\n');

const imagesDir = './public/images';

// Images we're actually using in the app
const requiredImages = {
  '🕷️ Spider-Man': 'spidermansmall.png',
  '🦸‍♀️ Kim Possible': 'supergirl.png',
  '👾 Thanos': 'Thanos.png',
  '🐷 Peppa Pig': 'peppapig.png',
  '🐾 Black Panther': 'blackpantherlogo.png',
  '🐱 Tom': 'tom.png',
  '⛄ Olaf': 'olaf.png',
  '🛡️ Captain America': 'Captain america.png',
  '🏢 SNS Logo': 'snslogo.png',
  '🏢 SNS Academy Logo': 'snsacademylogo.png',
};

console.log('📋 Checking Required Images:\n');

let allFound = true;

Object.entries(requiredImages).forEach(([name, filename]) => {
  const filePath = path.join(imagesDir, filename);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`✅ ${name.padEnd(25)} → ${filename.padEnd(30)} (${sizeKB} KB)`);
  } else {
    console.log(`❌ ${name.padEnd(25)} → ${filename.padEnd(30)} MISSING!`);
    allFound = false;
  }
});

console.log('\n=====================================\n');

if (allFound) {
  console.log('🎉 SUCCESS! All images found!\n');
  console.log('✨ Your SNS Playbook is ready with hero images!\n');
  console.log('🚀 Run: npm run dev\n');
  console.log('Then visit: http://localhost:3000\n');
} else {
  console.log('⚠️  Some images are missing!\n');
  console.log('Please check the filenames above.\n');
}

// Show additional images available
const allImages = fs.readdirSync(imagesDir)
  .filter(f => f.endsWith('.png') || f.endsWith('.jpg'))
  .filter(f => !Object.values(requiredImages).includes(f));

if (allImages.length > 0) {
  console.log(`📦 Additional images available (${allImages.length}):\n`);
  allImages.slice(0, 10).forEach(img => {
    const stats = fs.statSync(path.join(imagesDir, img));
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`   - ${img.padEnd(40)} (${sizeKB} KB)`);
  });
  if (allImages.length > 10) {
    console.log(`   ... and ${allImages.length - 10} more\n`);
  }
}

console.log('\n💡 Tip: You can use these additional images by updating');
console.log('   the character mappings in utils/constants.ts\n');
