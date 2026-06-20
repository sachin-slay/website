import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imgDir = path.resolve('./public/images');
const files = fs.readdirSync(imgDir);

async function run() {
    for (const file of files) {
        if (file.endsWith('.webp') && file !== 'logo.webp') {
            const filePath = path.join(imgDir, file);
            const tempPath = path.join(imgDir, `temp-${file}`);
            
            // Re-compress the image to lower quality/size to ensure < 200KB
            // We'll resize them slightly if they are huge to save space
            await sharp(filePath)
                .resize({ width: 1200, withoutEnlargement: true })
                .webp({ quality: 60, effort: 6 })
                .toFile(tempPath);
            
            fs.renameSync(tempPath, filePath);
            console.log(`Compressed ${file}`);
        }
    }

    // Generate og-image.png (1200x630) with logo centered on #FCEEF0 background
    await sharp({
        create: {
            width: 1200,
            height: 630,
            channels: 4,
            background: { r: 252, g: 238, b: 240, alpha: 1 } // #FCEEF0
        }
    })
    .composite([{ input: path.join(imgDir, 'logo.webp'), gravity: 'center' }])
    .png()
    .toFile(path.join(imgDir, 'og-image.png'));
    console.log('Created og-image.png');

    // Generate apple-touch-icon.png (180x180) from logo
    await sharp(path.join(imgDir, 'logo.webp'))
        .resize({ width: 180, height: 180, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toFile(path.join(imgDir, 'apple-touch-icon.png'));
    console.log('Created apple-touch-icon.png');
}

run().catch(console.error);
