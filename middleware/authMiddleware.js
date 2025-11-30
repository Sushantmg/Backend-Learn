const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is missing in environment variables");
}


function validateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization format invalid" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(401).json({ error: "Token invalid" });
    }

   
    req.user = decoded;
    req.role = decoded.role;
    req.user_id = decoded.id;

    next();
  } catch (error) {
    console.error("validateToken error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

function superUserOnly(req, res, next) {
  if (!req.role) {
    return res.status(401).json({ error: "Valid token not found" });
  }

  if (req.role === "SUPERUSER") {
    return next();
  }

  return res.status(403).json({ error: "Forbidden: Superuser only" });
}

function staffOnly(req, res, next) {
  if (!req.role) {
    return res.status(401).json({ error: "Valid token not found" });
  }

  if (req.role === "STAFF" || req.role === "SUPERUSER") {
    return next();
  }

  return res.status(403).json({ error: "Forbidden: Staff only" });
}

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};

module.exports = {
  validateToken,
  superUserOnly,
  staffOnly,
  allowRoles,
};
