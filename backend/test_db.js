
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Testing connection...')
    await prisma.$connect()
    console.log('Connected successfully!')
    const count = await prisma.lead.count()
    console.log('Number of leads:', count)
  } catch (e) {
    console.error('Connection failed:')
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
