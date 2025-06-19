// filepath: c:\Users\fishi\Coding\AnnaKolb\scripts\syncDrive.js
const { google } = require("googleapis");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

// Load service account credentials
// const credentials = require("../anna-kolb-art.json");
// const credentials = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
let credentials;

if (process.env.SERVICE_ACCOUNT_JSON) {
  credentials = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
} else {
  credentials = require("../anna-kolb-art.json"); // fallback for local dev
}

// Google Drive parent folder ID
const PARENT_FOLDER_ID = "1Ic3Y2Q0cINejiKT1BMsht0qSfnSgJdFT";
const VERCEL_HOOK_URL =
  "https://api.vercel.com/v1/integrations/deploy/prj_DI7zIt8xyS5MO1RdLRaod8wby4Ed/WcwHSMgmgo";

// Path to the local imgs directory from project root
const LOCAL_IMG_DIR = path.join(__dirname, "..", "public", "imgs");

// Authenticate with Google Drive API
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/drive"], // Full drive access needed for permission management
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

// Convert Google Drive file ID to direct image URL
function getDriveImageUrl(fileId) {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

// Completely rebuild the artworks.js file with Drive URLs
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

    artworksEntries.push(`
  {
    id: ${id},
    src: "${getDriveImageUrl(img.fileId)}",
    title: "${img.title || `Art ${id}`}",
    category: "${img.category}",
  }`);
  });

  // Create the new artworks.js content
  const newContent = `// Auto-generated from Google Drive
const artworks = [${artworksEntries.join(",")}];

export default artworks;`;

  // Write the updated content back to the file
  fs.writeFileSync(artworksPath, newContent, "utf8");
  console.log(`Rebuilt artworks.js with ${artworksEntries.length} Drive URLs`);
}

// Make a file viewable by anyone with the link
async function makeFileViewableByLink(fileId) {
  try {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    console.log(`Made file ${fileId} viewable by anyone with link`);
  } catch (error) {
    if (error.code !== 409) {
      // Ignore if permission already exists
      console.error(`Failed to make file ${fileId} viewable:`, error.message);
    }
  }
}

// Update the main sync function
async function syncDriveToLocal() {
  try {
    const categoryFolders = await getSubfolders(PARENT_FOLDER_ID);
    console.log(`Found ${categoryFolders.length} category folders`);

    const allDriveImages = [];

    for (const folder of categoryFolders) {
      const categoryName = folder.name.toLowerCase();
      console.log(`Processing category: ${categoryName}`);

      const files = await listFilesInFolder(folder.id);
      console.log(`Found ${files.length} images in category ${categoryName}`);

      for (const file of files) {
        allDriveImages.push({
          fileId: file.id,
          filename: file.name,
          category: categoryName,
          modifiedTime: file.modifiedTime,
        });
      }
    }

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
