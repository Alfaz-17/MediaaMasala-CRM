
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Testing Task Creation with Project/Product...")
    
    // Find valid data
    const employee = await prisma.employee.findFirst()
    const project = await (prisma as any).project.findFirst()
    const product = await (prisma as any).product.findFirst()
    
    if (!employee) {
      console.log("No employees found.")
      return
    }

    console.log(`Using Employee: ${employee.id}, Project: ${project?.id}, Product: ${product?.id}`)

    const task = await (prisma as any).task.create({
      data: {
        title: "Test Relation Task",
        description: "Testing relations",
        dueDate: new Date(),
        priority: "Low",
        status: "Pending",
        assigneeId: employee.id,
        creatorId: employee.id,
        projectId: project ? project.id : null,
        productId: product ? product.id : null
      }
    })
    
    console.log("Relational Task created successfully:", task.id)
    
    // Cleanup
    await (prisma as any).task.delete({ where: { id: task.id } })
    console.log("Test cleanup complete.")

  } catch (error) {
    console.error("RELATIONAL PRISMA TEST FAILED:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
