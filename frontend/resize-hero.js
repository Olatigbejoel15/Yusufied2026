// One-time script: shrinks the pre-wedding photos for the website
const fs = require("fs");
const path = require("path");
const sharp = require("sharp"); // Image tool that Next.js installs

const input = "C:/Users/DELL/Desktop/prewedding"; // Folder with the original photos
const output = path.join(__dirname, "public", "hero"); // Where the resized photos go

fs.mkdirSync(output, { recursive: true }); // Create public/hero if it is missing
const files = fs.readdirSync(input).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)); // Only image files

files.forEach((file, i) => {
  sharp(path.join(input, file))
    .rotate() // Fix sideways phone photos
    .resize({ width: 1920, withoutEnlargement: true }) // Max 1920 px wide, never enlarge
    .jpeg({ quality: 78, mozjpeg: true }) // Smaller file, still sharp
    .toFile(path.join(output, `${i + 1}.jpg`)) // Save as 1.jpg, 2.jpg, 3.jpg...
    .then(() => console.log(`done ${i + 1}.jpg`));
});