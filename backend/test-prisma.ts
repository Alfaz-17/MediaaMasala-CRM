
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Testing Task Creation...")
    
    // Find a valid employee
    const employee = await prisma.employee.findFirst()
    if (!employee) {
      console.log("No employees found to assign task.")
      return
    }

    const task = await prisma.task.create({
      data: {
        title: "Test Task",
        description: "Direct test creation",
        dueDate: new Date(),
        priority: "Low",
        status: "Pending",
        assigneeId: employee.id,
        creatorId: employee.id
      }
    })
    
    console.log("Task created successfully:", task.id)
    
    // Cleanup
    await prisma.task.delete({ where: { id: task.id } })
    console.log("Test cleanup complete.")

  } catch (error) {
    console.error("PRISMA TEST FAILED:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
