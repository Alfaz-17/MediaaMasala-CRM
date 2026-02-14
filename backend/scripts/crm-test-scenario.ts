
import { PrismaClient, LeadStatus, LeadSource } from '@prisma/client';

const prisma = new PrismaClient();

async function runScenario() {
  console.log("--- STARTING ULTIMATE CRM TEST SCENARIO ---\n");

  // 0. Setup Context (User/Employee)
  const employee = await prisma.employee.findFirst();
  if (!employee) {
    console.error("❌ No employees found. Please seed the database first.");
    return;
  }
  const currentUserId = employee.id;
  const currentDepartmentId = employee.departmentId;
  console.log(`🤖 Acting as: ${employee.firstName} ${employee.lastName} (ID: ${currentUserId})`);

  // 1. Check Dashboard (Tasks & Leads)
  console.log("\n--- STEP 1: CHECK DASHBOARD ---");
  const today = new Date();
  const startOfDay = new Date(today.setHours(0,0,0,0));
  const endOfDay = new Date(today.setHours(23,59,59,999));

  const tasksDueToday = await prisma.task.count({
    where: {
      assigneeId: currentUserId,
      dueDate: {
        gte: startOfDay,
        lte: endOfDay
      },
      status: { not: 'Completed' }
    }
  });
  
  const overdueTasks = await prisma.task.count({
    where: {
        assigneeId: currentUserId,
        dueDate: { lt: startOfDay },
        status: { not: 'Completed' }
    }
  });

  console.log(`✅ Dashboard Check:`);
  console.log(`- Tasks Due Today: ${tasksDueToday}`);
  console.log(`- Overdue Tasks: ${overdueTasks}`);
  if (tasksDueToday + overdueTasks === 0) {
      console.log("- No immediate attention items found. You're all caught up!");
  } else {
      console.log("- Attention Required: Check your task list.");
  }


  // 2. Create Lead: Sarah Chen
  console.log("\n--- STEP 2: CREATE LEAD (Sarah Chen) ---");
  try {
    const newLead = await prisma.lead.create({
      data: {
        name: "Sarah Chen",
        company: "DataFlow Systems",
        email: "sarah.chen@dataflow.example.com", // Placeholder
        phone: "555-0123", // Placeholder
        source: LeadSource.Cold_Call,
        status: LeadStatus.Follow_Up, // Mapping 'Contacted' to 'Follow_Up'
        departmentId: currentDepartmentId,
        ownerId: currentUserId,
        notes: "Needs demo by Friday, budget approved for Q2, decision maker"
      }
    });
    console.log(`✅ Lead Created: ${newLead.name} (${newLead.company}) - ID: ${newLead.id}`);
    console.log(`- Status: ${newLead.status}`);
    console.log(`- Note: ${newLead.notes}`);
  } catch (e) {
    console.error("❌ Failed to create lead:", e);
  }

  // 3. Create Follow-up Task for Sarah
  console.log("\n--- STEP 3: CREATE FOLLOW-UP TASK ---");
  // Find Sarah again to get her ID (in case previous step failed or we use existing)
  const sarahLead = await prisma.lead.findFirst({ where: { email: "sarah.chen@dataflow.example.com" } });
  if (sarahLead) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0); // 2 PM

      const newTask = await prisma.task.create({
          data: {
              title: "Send Proposal to DataFlow",
              description: "Send Enterprise plan proposal ($50K/year)",
              priority: "High",
              status: "Pending",
              dueDate: tomorrow,
              assigneeId: currentUserId,
              relatedToLeadId: sarahLead.id
          }
      });
      console.log(`✅ Task Created: "${newTask.title}"`);
      console.log(`- Due: ${newTask.dueDate.toLocaleString()}`);
      console.log(`- Linked to: ${sarahLead.name}`);
  } else {
      console.log("⚠️ Skipping Task Creation: Lead not found.");
  }

  // 4. Find "Qualified" Leads > 7 Days Inactive
  console.log("\n--- STEP 4: FIND STAGNANT QUALIFIED LEADS ---");
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  // Note: 'Qualified' isn't in enum, mapping to 'Prospect' or 'Hot_Prospect'
  const qualifiedLeads = await prisma.lead.findMany({
      where: {
          status: { in: [LeadStatus.Prospect, LeadStatus.Hot_Prospect] },
          updatedAt: { lt: sevenDaysAgo }
      },
      take: 3,
      orderBy: { createdAt: 'desc' } // Proxy for 'company size' since we don't have that field
  });
  
  console.log(`✅ Found ${qualifiedLeads.length} stagnant qualified leads (showing top 3):`);
  qualifiedLeads.forEach(l => console.log(`- ${l.name} (${l.company}) - Last Update: ${l.updatedAt.toLocaleDateString()}`));


  // 5. EOD Report Generation (Simulation)
  console.log("\n--- STEP 5: GENERATE EOD REPORT ---");
  const leadsToday = await prisma.lead.count({
      where: { createdAt: { gte: startOfDay } }
  });
  const tasksCompletedToday = await prisma.task.count({
      where: { 
          status: 'Completed',
          updatedAt: { gte: startOfDay }
      }
  });
  const tasksPending = await prisma.task.count({ where: { status: 'Pending' } });

  console.log(`📊 END OF DAY REPORT (${today.toLocaleDateString()})`);
  console.log(`- New Leads: ${leadsToday}`);
  console.log(`- Tasks Completed: ${tasksCompletedToday}`);
  console.log(`- Tasks Pending: ${tasksPending}`);
  console.log(`- Pipeline Health: Active`); // Placeholder logic


  // 6. Convert Lead & Create Project (John Martinez)
  console.log("\n--- STEP 6: CONVERT LEAD TO PROJECT ---");
  // Ensure John exists
  let johnLead = await prisma.lead.findFirst({ where: { name: "John Martinez", company: "GlobalTech Corp" } });
  if (!johnLead) {
      johnLead = await prisma.lead.create({
          data: {
              name: "John Martinez",
              company: "GlobalTech Corp",
              email: "john.m@globaltech.example.com",
              source: LeadSource.Referral,
              status: LeadStatus.Prospect,
              departmentId: currentDepartmentId,
              ownerId: currentUserId
          }
      });
      console.log(`(Created dummy lead for John Martinez)`);
  }

  // Update Status
  const convertedJohn = await prisma.lead.update({
      where: { id: johnLead.id },
      data: { status: LeadStatus.Won } // 'Converted' mapping to 'Won'
  });
  console.log(`✅ Default Lead Status Updated to: ${convertedJohn.status}`);

  // Create Project
  try {
      // Check if project already exists to avoid unique constraint error
      const existingProj = await prisma.project.findUnique({ where: { leadId: convertedJohn.id } });
      let project;
      if (existingProj) {
          project = existingProj;
          console.log(`ℹ️ Project already exists for this lead.`);
      } else {
          project = await prisma.project.create({
              data: {
                  name: "GlobalTech Onboarding",
                  description: "Onboarding project for new enterprise client",
                  status: "Active",
                  leadId: convertedJohn.id
              }
          });
          console.log(`✅ Project Created: "${project.name}" (ID: ${project.id})`);
      }
  } catch (e) {
      console.error("❌ Failed to create project:", e);
  }

  // 7. Schedule Team Meeting
  console.log("\n--- STEP 7: SCHEDULE TEAM MEETING ---");
  const friday = new Date();
  // Simple logic to find next friday
  const day = friday.getDay();
  const diff = 5 - day + (day >= 5 ? 7 : 0);
  friday.setDate(friday.getDate() + diff);
  friday.setHours(10, 0, 0, 0);

  const meetingTask = await prisma.task.create({
      data: {
          title: "Q1 Targets Team Meeting",
          description: "Discuss Q1 targets with sales team",
          priority: "Medium",
          status: "Pending",
          dueDate: friday,
          assigneeId: currentUserId // Assign to self for now
      }
  });
  console.log(`✅ Meeting Scheduled: "${meetingTask.title}"`);
  console.log(`- Time: ${meetingTask.dueDate.toLocaleString()}`);

  console.log("\n--- TEST SCENARIO COMPLETE ---");
}

runScenario()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
