const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Function to convert HEIC to JPEG
async function convertHeicToJpeg(inputPath, outputPath) {
  try {
    await sharp(inputPath).jpeg({ quality: 90 }).toFile(outputPath);
    console.log(
      `Converted: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`
    );
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error.message);
  }
}

// Function to process all HEIC files in a directory
async function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (file.toLowerCase().endsWith(".heic")) {
      const inputPath = path.join(dirPath, file);
      const outputPath = path.join(dirPath, file.replace(/\.heic$/i, ".jpg"));

      // Only convert if JPEG doesn't already exist
      if (!fs.existsSync(outputPath)) {
        await convertHeicToJpeg(inputPath, outputPath);
      } else {
        console.log(`JPEG already exists for: ${file}`);
      }
    }
  }
}

// Main execution
async function main() {
  const directories = ["public/imgs/houses", "public/imgs/cars"];

  for (const dir of directories) {
    if (fs.existsSync(dir)) {
      console.log(`\nProcessing directory: ${dir}`);
      await processDirectory(dir);
    }
  }

  console.log("\nConversion complete!");
}

main().catch(console.error);
