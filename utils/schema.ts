import z from "zod";

const productSchema = z.object({
  title: z.string({ error: "Title is required" }),
  description: z.string({ error: "Description is required" }),
  price: z.number({ error: "Price is required" }),
  rating: z.number({ error: "Rating is required" }),
});

const userSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  roles: z.enum(["SUPERUSER", "STAFF", "USER"]).optional(),
});

export { productSchema, userSchema };