import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('--- DATABASE CENSUS ---')
  
  const counts = {
    departments: await prisma.department.count(),
    roles: await prisma.role.count(),
    permissions: await prisma.permission.count(),
    users: await prisma.user.count(),
    employees: await prisma.employee.count(),
    leads: await prisma.lead.count(),
    tasks: await prisma.task.count(),
    assignmentLogs: await prisma.leadAssignmentLog.count(),
  }

  console.log('RECORD COUNTS:', JSON.stringify(counts, null, 2))

  const samples = {
    departments: await prisma.department.findMany({ select: { name: true, code: true } }),
    roles: await prisma.role.findMany({ select: { name: true, code: true } }),
    users: await prisma.user.findMany({ select: { email: true, role: { select: { code: true } } } }),
    employees: await prisma.employee.findMany({ select: { firstName: true, lastName: true, email: true } }),
    leads: await prisma.lead.findMany({ take: 5, select: { name: true, status: true } }),
  }

  console.log('DATA SAMPLES:', JSON.stringify(samples, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
