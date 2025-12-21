import fs from "fs";
import path from "path";

export async function fileUpload(file: Express.Multer.File) {
  try {
    const uploadFolder = path.join(process.cwd(), "uploads");

    // Ensure folder exists
    fs.mkdirSync(uploadFolder, { recursive: true });

    // Sanitize filename
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "_");
    const fileName = `${timestamp}_${safeName}`;

    const filePath = path.join(uploadFolder, fileName);

    // Async write
    await fs.promises.writeFile(filePath, file.buffer);

    return {
      fileName,
      path: `uploads/${fileName}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  } catch (error) {
    console.error(error);
    throw new Error("File upload failed");
  }
}
