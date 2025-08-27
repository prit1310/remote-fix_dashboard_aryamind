const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Create super admin
  const password = await bcrypt.hash('Prit@1310', 10);
  await prisma.user.upsert({
    where: { email: 'admin@prit.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@prit.com',
      phone: '0000000000',
      password,
      role: 'superadmin',
    },
  });

  // Create some services
  await prisma.service.createMany({
    data: [
      { name: "Computer Repair" },
      { name: "Network Support" },
      { name: "Software Support" }
    ],
    skipDuplicates: true
  });

  console.log("Seeded super admin and services!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());