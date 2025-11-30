const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function main() {
  const SUPERUSER_EMAIL = "admin@hamromart.com";
  const SUPERUSER_PASSWORD = "admin123"; 

  
  const hashedPassword = await bcrypt.hash(SUPERUSER_PASSWORD, 10);

  
  const superuser = await prisma.user.upsert({
    where: { email: SUPERUSER_EMAIL },
    update: {}, 
    create: {
      name: "System Admin",
      email: SUPERUSER_EMAIL,
      password: hashedPassword,
      role: "SUPERUSER",
    },
  });

  console.log("SUPERUSER ready:", superuser.email);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
