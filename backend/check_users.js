
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    include: {
      employee: true
    }
  });
  console.log('Total Users:', users.length);
  users.forEach(u => {
    console.log(`- Email: ${u.email}, Active: ${u.isActive}, Has Employee: ${!!u.employee}`);
  });
  process.exit(0);
}

checkUsers();
