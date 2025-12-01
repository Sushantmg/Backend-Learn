import { Request, Response, NextFunction } from "express";
import { z, ZodType } from "zod";

// Make it generic so it works for any schema
export const validationMiddleware = <T>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate body
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const prettyError = error.flatten();
        res.status(400).json(prettyError.fieldErrors);
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };
};
