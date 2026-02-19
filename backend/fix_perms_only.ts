
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== FIXING BM & BDM PERMISSIONS ===');

  const roleBM = await prisma.role.findUnique({ where: { code: 'SALES_BM' } });
  const roleBDM = await prisma.role.findUnique({ where: { code: 'SALES_BDM' } });

  if (!roleBM || !roleBDM) {
    console.error('Missing roles');
    return;
  }

  const updates = [
    { role: roleBM, roleName: 'BM', module: 'employees', action: 'view', scope: 'team' },
    { role: roleBM, roleName: 'BM', module: 'eod', action: 'view', scope: 'team' },
    { role: roleBDM, roleName: 'BDM', module: 'employees', action: 'view', scope: 'team' },
  ];

  for (const update of updates) {
    console.log(`\nProcessing ${update.roleName} -> ${update.module}:${update.action} -> Scope: ${update.scope}`);

    // 1. Find or Create the target permission
    const targetPerm = await prisma.permission.upsert({
      where: { 
        module_action_scopeType: { 
          module: update.module, 
          action: update.action, 
          scopeType: update.scope 
        } 
      },
      update: {},
      create: {
        module: update.module,
        action: update.action,
        scopeType: update.scope,
        description: `Can ${update.action} ${update.module} (Scope: ${update.scope})`
      }
    });

    // 2. Find ALL existing permissions for this role+module+action
    const currentRolePerms = await prisma.rolePermission.findMany({
      where: { 
        roleId: update.role.id, 
        permission: { 
          module: update.module, 
          action: update.action 
        } 
      },
      include: { permission: true }
    });

    console.log(`  Found ${currentRolePerms.length} existing permissions for this action.`);

    // 3. Delete conflicting ones
    for (const crp of currentRolePerms) {
      if (crp.permission.scopeType !== update.scope) {
        console.log(`  🗑️ Deleting conflict: Scope ${crp.permission.scopeType}`);
        await prisma.rolePermission.delete({
          where: { roleId_permissionId: { roleId: update.role.id, permissionId: crp.permissionId } }
        });
      } else {
        console.log(`  ✅ Keeping match: Scope ${crp.permission.scopeType}`);
      }
    }

    // 4. Upsert target
    /*
      Note: Upsert might fail if strict unique constraint on (roleId, permissionId) is hit 
      but we just deleted potential conflicts. 
      However, if the target already exists (from step 3 check), upsert handles it.
    */
    const exists = currentRolePerms.find(crp => crp.permission.scopeType === update.scope);
    if (!exists) {
        console.log(`  ➕ Adding target permission`);
        await prisma.rolePermission.create({
            data: { roleId: update.role.id, permissionId: targetPerm.id }
        });
    }
  }

  console.log('\n=== DONE ===');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
