// prisma-config.js
const { PrismaClient, Roles } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = { prisma, Roles };
