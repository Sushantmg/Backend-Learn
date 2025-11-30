const { default:z} = require("zod");

const userSchema =z.object({
    name : z.string(),
    email : z.string(),
    password : z.string(),
    roles: z.enum(["SUPERUSER","USER","STAFF"]).optional()

})

const productSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string().optional().default(""),
  price: z.number().optional().default(0),
  rating: z.number().optional().default(0),
});

module.exports ={userSchema,productSchema};