import fs from "fs";
import path from "path";

export function fileUpload(file: Express.Multer.File, subDirectory?: string) {
  try {
    const uploadFolder = `uploads/${
      subDirectory !== undefined ? subDirectory + "/" : ""
    }`;
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }
    const d = new Date();
    const timestamp = d.getTime();
    const fileName = timestamp + "-" + file?.originalname;
    let filePath;
    filePath = path.join(uploadFolder, fileName);
    fs.writeFileSync(filePath, file.buffer);
    const finalPath = `${uploadFolder}${fileName}`;
    return finalPath;
  } catch (error) {
    console.log(error);
    throw new Error("File Upload Filed!!");
  }
}

export function fileDelete(filePath: string) {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.log(error);
    throw new Error("File deletion failed!!");
  }
}