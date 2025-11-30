
const { default:z} = require("zod");

const validationMiddleware = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const prettyError = z.flattenError(error);
    res.status(400).json(prettyError);
  }
};
module.exports = { validationMiddleware };
