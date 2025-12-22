import fs from "fs";
import path from "path";

export async function fileUpload(
  file: Express.Multer.File,
  subDirectory?: string
) {
  try {
    const baseUploadFolder = path.join(process.cwd(), "uploads");

    // Ensure base uploads folder exists
    fs.mkdirSync(baseUploadFolder, { recursive: true });

    // If subDirectory provided, create it
    const finalUploadFolder = subDirectory
      ? path.join(baseUploadFolder, subDirectory)
      : baseUploadFolder;

    fs.mkdirSync(finalUploadFolder, { recursive: true });

    // Sanitize filename (extra safe)
    const timestamp = Date.now();
    const safeName = path
      .basename(file.originalname)
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    const fileName = `${timestamp}_${safeName}`;

    const filePath = path.join(finalUploadFolder, fileName);

    // Async write (non-blocking)
    await fs.promises.writeFile(filePath, file.buffer);

    // Relative path for DB storage
    const relativePath = subDirectory
      ? `uploads/${subDirectory}/${fileName}`
      : `uploads/${fileName}`;

    return {
      fileName,
      path: relativePath,
      size: file.size,
      mimetype: file.mimetype,
    };
  } catch (error) {
    console.error(error);
    throw new Error("File upload failed");
  }
}
