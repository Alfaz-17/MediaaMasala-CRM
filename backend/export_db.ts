import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function exportData() {
  const tableMapping = [
    { prisma: 'department', sql: 'departments' },
    { prisma: 'role', sql: 'roles' },
    { prisma: 'permission', sql: 'permissions' },
    { prisma: 'rolePermission', sql: 'role_permissions' },
    { prisma: 'user', sql: 'users' },
    { prisma: 'employee', sql: 'employees' },
    { prisma: 'lead', sql: 'leads' },
    { prisma: 'task', sql: 'tasks' },
    { prisma: 'product', sql: 'products' },
    { prisma: 'leadAssignmentLog', sql: 'lead_assignment_logs' },
    { prisma: 'followUpLog', sql: 'follow_up_logs' },
    { prisma: 'leadNote', sql: 'lead_notes' },
    { prisma: 'eodReport', sql: 'eod_reports' },
    { prisma: 'project', sql: 'projects' },
    { prisma: 'attendance', sql: 'attendance' },
    { prisma: 'leaveRequest', sql: 'leave_requests' },
    { prisma: 'activityLog', sql: 'activity_logs' }
  ];

  let sql = '-- Database Backup\n';
  sql += 'SET session_replication_role = \'replica\';\n\n';

  for (const mapping of tableMapping) {
    console.log(`Exporting ${mapping.sql}...`);
    const data = await (prisma as any)[mapping.prisma].findMany();
    
    if (data.length > 0) {
      sql += `-- Data for table ${mapping.sql}\n`;
      for (const row of data) {
        const columns = Object.keys(row).join(', ');
        const values = Object.values(row).map(val => {
          if (val === null) return 'NULL';
          if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
          if (val instanceof Date) return `'${val.toISOString()}'`;
          if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
          return val;
        }).join(', ');
        sql += `INSERT INTO ${mapping.sql} (${columns}) VALUES (${values});\n`;
      }
      sql += '\n';
    }
  }

  sql += '\nSET session_replication_role = \'origin\';\n';
  fs.writeFileSync('../database_backup.sql', sql);
  console.log('Backup completed: ../database_backup.sql');
}

exportData()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
