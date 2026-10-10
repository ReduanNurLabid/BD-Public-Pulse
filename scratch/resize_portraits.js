import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcDir = 'c:/Users/Reduan/Downloads/bd-political-compass/src/assets';
const destDir = 'c:/Users/Reduan/Downloads/bd-political-compass/public/personalities/portraits';

const mappings = {
  'mujib.jpg': 'mujib.jpg',
  'tajuddin.jpg': 'tajuddin.jpg',
  'suhrawardy.webp': 'suhrawardy.jpg',
  'rokeya.jpg': 'rokeya.jpg', // if present
  'bhashani.jpg': 'bhashani.jpg',
  'Martyr_Surjya_Sen.jpg': 'surya-sen.jpg',
  'netajishubhash.webp': 'subhas-bose.jpg',
  'monisingh.png': 'moni-singh.jpg',
  'fazlul-huq.jpg': 'fazlul-huq.jpg',
  'Ziaur_Rahman_1979.jpg': 'ziaur-rahman.jpg',
  'ershad.jpg': 'ershad.jpg',
  'Syed_Ahmad_Khan_1907.jpg': 'syed-ahmed.jpg',
  'Syed_Mir_Nisar_Ali_(Titumir).jpg': 'titumir.jpg',
  'Haji_Shariatullah.jpg': 'shariatullah.jpg',
  'lalon.jpg': 'lalon.jpg',
  'gettyimages-3270228-594x594.jpg': 'unknown.jpg'
};

async function processImages() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  for (const [srcName, destName] of Object.entries(mappings)) {
    const srcPath = path.join(srcDir, srcName);
    const destPath = path.join(destDir, destName);

    if (fs.existsSync(srcPath)) {
      try {
        await sharp(srcPath)
          .resize(500, 500, {
            fit: 'cover',
            position: 'top' // face is usually at the top
          })
          .jpeg({ quality: 85 })
          .toFile(destPath);
        console.log(`✅ Processed: ${destName}`);
      } catch (err) {
        console.error(`❌ Error processing ${srcName}:`, err.message);
      }
    } else {
      console.log(`⚠️ Missing: ${srcName}`);
    }
  }
}

processImages();
