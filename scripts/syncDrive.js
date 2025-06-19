// filepath: c:\Users\fishi\Coding\AnnaKolb\scripts\syncDrive.js
const { google } = require("googleapis");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

// Load service account credentials
// const credentials = require("../anna-kolb-art.json");
const credentials = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);

// Google Drive parent folder ID
const PARENT_FOLDER_ID = "1Ic3Y2Q0cINejiKT1BMsht0qSfnSgJdFT";
const VERCEL_HOOK_URL =
  "https://api.vercel.com/v1/integrations/deploy/prj_DI7zIt8xyS5MO1RdLRaod8wby4Ed/WcwHSMgmgo";

// Path to the local imgs directory from project root
const LOCAL_IMG_DIR = path.join(__dirname, "..", "public", "imgs");

// Authenticate with Google Drive API
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

// Get all subfolders in the parent folder
async function getSubfolders(parentFolderId) {
  const res = await drive.files.list({
    q: `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
  });

  return res.data.files;
}

// List image files in a folder with modifiedTime to preserve order
async function listFilesInFolder(folderId) {
  const files = [];
  let pageToken = null;

  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: "nextPageToken, files(id, name, modifiedTime)",
      orderBy: "modifiedTime",
      pageToken,
    });

    files.push(...res.data.files);
    pageToken = res.data.nextPageToken;
  } while (pageToken);

  return files;
}

// Download a file from Drive
async function downloadFile(fileId, destPath) {
  const dest = fs.createWriteStream(destPath);
  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" }
  );

  await new Promise((resolve, reject) => {
    res.data.on("end", resolve).on("error", reject).pipe(dest);
  });
}

// Add this helper function to sanitize filenames for URLs
function sanitizeFileName(filename) {
  return filename.replace(/\s+/g, "_");
}

// Completely rebuild the artworks.js file with the current images
async function rebuildArtworksFile(allImages) {
  const artworksPath = path.join(__dirname, "..", "src", "data", "artworks.js");

  // Create new artworks entries
  let artworksEntries = [];

  // Sort images by modifiedTime if available
  allImages.sort((a, b) => {
    if (a.modifiedTime && b.modifiedTime) {
      return new Date(a.modifiedTime) - new Date(b.modifiedTime);
    }
    return 0;
  });

  // Create artwork entries with sequential IDs
  allImages.forEach((img, index) => {
    const id = index + 1;
    // Sanitize the filename to replace spaces with underscores
    const sanitizedFilename = sanitizeFileName(img.filename);
    const imgPath = `${img.category}/${sanitizedFilename}`;

    artworksEntries.push(`
  {
    id: ${id},
    src: process.env.PUBLIC_URL + "/imgs/${imgPath}",
    title: "${img.title || `Art ${id}`}",
    category: "${img.category}",
  }`);
  });

  // Create the new artworks.js content
  const newContent = `// filepath: c:\\Users\\fishi\\Coding\\AnnaKolb\\src\\data\\artworks.js
const artworks = [${artworksEntries.join(",")}];

export default artworks;`;

  // Write the updated content back to the file
  fs.writeFileSync(artworksPath, newContent, "utf8");
  console.log(`Rebuilt artworks.js with ${artworksEntries.length} entries`);
}

// Main function to sync files and update artworks.js
async function syncDriveToLocal() {
  try {
    // Ensure the local imgs directory exists
    fs.ensureDirSync(LOCAL_IMG_DIR);

    // Get all category folders
    const categoryFolders = await getSubfolders(PARENT_FOLDER_ID);
    console.log(`Found ${categoryFolders.length} category folders`);

    const allDriveImages = [];
    const localImagesToKeep = new Set();

    // Process each category folder
    for (const folder of categoryFolders) {
      const categoryName = folder.name.toLowerCase();
      console.log(`Processing category: ${categoryName}`);

      // Ensure category directory exists
      const categoryDir = path.join(LOCAL_IMG_DIR, categoryName);
      fs.ensureDirSync(categoryDir);

      // Get all image files in this category
      const files = await listFilesInFolder(folder.id);
      console.log(`Found ${files.length} images in category ${categoryName}`);

      // Download each file if it doesn't exist locally
      for (const file of files) {
        // Sanitize the filename to replace spaces with underscores
        const sanitizedFilename = sanitizeFileName(file.name);
        const localFilePath = path.join(categoryDir, sanitizedFilename);
        const relativePath = `${categoryName}/${sanitizedFilename}`;

        // Add to the list of files to keep
        localImagesToKeep.add(relativePath);

        // Check if the file already exists locally
        if (!fs.existsSync(localFilePath)) {
          console.log(
            `Downloading ${file.name} to ${categoryName} as ${sanitizedFilename}...`
          );
          await downloadFile(file.id, localFilePath);
        } else {
          console.log(
            `${sanitizedFilename} already exists in ${categoryName}, skipping.`
          );
        }

        // Add to the list of all images (for rebuilding artworks.js)
        allDriveImages.push({
          filename: sanitizedFilename, // Use sanitized filename
          category: categoryName,
          modifiedTime: file.modifiedTime,
        });
      }
    }

    // Delete local files that are no longer in Google Drive
    for (const category of await fs.readdir(LOCAL_IMG_DIR)) {
      const categoryDir = path.join(LOCAL_IMG_DIR, category);

      // Skip if not a directory
      if (!fs.statSync(categoryDir).isDirectory()) continue;

      for (const file of await fs.readdir(categoryDir)) {
        const relativePath = `${category}/${file}`;

        if (!localImagesToKeep.has(relativePath)) {
          const filePath = path.join(categoryDir, file);
          console.log(`Deleting ${relativePath} - no longer in Google Drive`);
          await fs.remove(filePath);
        }
      }
    }

    // Rebuild artworks.js with the current images in order
    await rebuildArtworksFile(allDriveImages);

    console.log("Sync complete!");
    console.log("Triggering Vercel redeploy...");
    try {
      await axios.post(VERCEL_HOOK_URL);
      console.log("✅ Vercel redeploy triggered successfully.");
    } catch (error) {
      console.error("❌ Failed to trigger Vercel redeploy:", error.message);
    }
  } catch (error) {
    console.error("Error syncing files:", error);
    console.error(error.stack);
  }
}

syncDriveToLocal();
