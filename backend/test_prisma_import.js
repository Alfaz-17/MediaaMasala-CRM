
const prisma = require('./src/lib/prisma').default;

console.log('Prisma Object keys:', Object.keys(prisma || {}));
if (prisma && prisma.user) {
  console.log('Prisma User model found');
} else {
  console.log('Prisma User model NOT found');
}
process.exit(0);
