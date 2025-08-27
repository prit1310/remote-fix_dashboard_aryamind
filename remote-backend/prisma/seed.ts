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
      name: 'Prit Senjaliya',
      email: 'admin@prit.com',
      phone: '0000000000',
      password,
      role: 'superadmin',
    },
  });

  // Create some services
  await prisma.service.createMany({
    data: [
      { name: "System Diagnostics" },
      { name: "Data Recovery" },
      { name: "Network Issues" },
      { name: "Virus Removal" },
      { name: "Software Installation" },
      { name: "System Optimization" },
      { name: "System Cleanup" },
      { name: "Security Setup" },
      { name: "System Restore" }
    ],
    skipDuplicates: true
  });

  console.log("Seeded super admin and services!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());