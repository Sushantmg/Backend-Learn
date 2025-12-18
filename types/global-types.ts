import "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;     // ✅ STRING
      email: string;
      role: "USER" | "STAFF" | "SUPERUSER";
    };
  }
}

export interface UploadRequest extends Request{
  image?:any;
}