-- Database Backup
SET session_replication_role = 'replica';

-- Data for table departments
INSERT INTO departments (id, name, code, description, isActive, createdAt, updatedAt) VALUES (41, 'Administration', 'ADMIN', 'Central Management', true, '2026-03-06T09:00:12.298Z', '2026-03-06T09:00:12.298Z');
INSERT INTO departments (id, name, code, description, isActive, createdAt, updatedAt) VALUES (42, 'Sales Department ', 'SALES', '', true, '2026-03-06T10:11:51.512Z', '2026-03-06T10:11:51.512Z');
INSERT INTO departments (id, name, code, description, isActive, createdAt, updatedAt) VALUES (43, 'Product Department', 'Product', '', true, '2026-03-06T10:12:10.864Z', '2026-03-06T10:12:10.864Z');
INSERT INTO departments (id, name, code, description, isActive, createdAt, updatedAt) VALUES (46, 'Operations Department ', 'OPS', '', true, '2026-03-06T12:42:11.644Z', '2026-03-06T12:42:11.644Z');
INSERT INTO departments (id, name, code, description, isActive, createdAt, updatedAt) VALUES (44, 'Creative Department ', 'CREARTIVE ', 'Creative handles everything visual that represents the company.

That includes:

Brand visuals

Marketing creatives

Product UI/UX

Project UI/UX

Design consistency across everything people see
', true, '2026-03-06T12:37:25.908Z', '2026-03-06T19:30:04.142Z');
INSERT INTO departments (id, name, code, description, isActive, createdAt, updatedAt) VALUES (47, 'Project Department', 'PORJECT', '', true, '2026-03-08T11:53:38.108Z', '2026-03-08T11:54:29.190Z');

-- Data for table roles
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (137, 'Admin', 'ADMIN', 'Full system control', 16, true, '2026-03-06T09:00:13.054Z', '2026-03-08T12:10:11.323Z', 41);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (138, 'Head Of Department', 'HOD', '', 20, true, '2026-03-06T10:12:46.262Z', '2026-03-08T12:10:11.742Z', 42);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (139, 'Business Development Executive', 'BDE', '', 16, true, '2026-03-06T10:14:19.821Z', '2026-03-08T12:10:12.075Z', 42);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (140, 'Business Development Manager', 'BDM', '', 16, true, '2026-03-06T10:14:53.249Z', '2026-03-08T12:10:12.408Z', 42);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (141, 'Business Manager', 'BM', '', 16, true, '2026-03-06T10:15:08.806Z', '2026-03-08T12:10:12.741Z', 42);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (142, 'Chief Executive Officer', 'CEO', '', 17, true, '2026-03-06T10:17:30.421Z', '2026-03-08T12:10:13.074Z', 41);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (143, 'Relationship Manager', 'RM', '', 18, true, '2026-03-06T10:19:55.898Z', '2026-03-08T12:10:13.407Z', 42);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (145, 'Operations Manager ', 'OM', '', 15, true, '2026-03-06T12:42:54.196Z', '2026-03-08T12:10:13.741Z', 46);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (147, 'Head Of Creative ', 'HOD_CreaTIVE', '', 13, true, '2026-03-06T12:51:24.703Z', '2026-03-08T12:10:14.074Z', 44);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (148, 'UIUX Designer', 'UIUX', '', 12, true, '2026-03-06T19:20:25.248Z', '2026-03-08T12:10:14.408Z', 44);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (149, 'Head Of Product ', 'HOD_PRODUCT', '', 10, true, '2026-03-06T20:43:20.160Z', '2026-03-08T12:10:14.741Z', 43);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (150, 'Product Manager', 'PM', '', 10, true, '2026-03-06T20:43:37.858Z', '2026-03-08T12:10:15.075Z', 43);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (151, 'Product Architect ', 'PROD_ARC', '', 10, true, '2026-03-06T20:44:26.300Z', '2026-03-08T12:10:15.408Z', 43);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (152, 'Graphic Designer ', 'GRA_DES', '', 6, true, '2026-03-06T21:25:13.492Z', '2026-03-08T12:10:15.741Z', 44);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (153, 'Product Developer  Intern', 'PROD_DEV_INTRN', '', 5, true, '2026-03-08T11:43:28.794Z', '2026-03-08T12:10:16.075Z', 43);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (154, 'UIUX Intern ', 'UIUX_INTRN', '', 4, true, '2026-03-08T11:45:43.814Z', '2026-03-08T12:10:16.408Z', 44);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (157, 'Graphic Designer Intern', 'GRA_DESi_INTRN', '', 4, true, '2026-03-08T11:46:47.119Z', '2026-03-08T12:10:16.741Z', 44);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (158, 'HR Manager', 'HRM', '', 4, true, '2026-03-08T11:50:41.627Z', '2026-03-08T12:10:17.075Z', 41);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (159, 'Head Of Project', 'HEAD_PROJ', '', 5, true, '2026-03-08T11:54:20.771Z', '2026-03-08T12:10:17.241Z', 47);
INSERT INTO roles (id, name, code, description, roleVersion, isActive, createdAt, updatedAt, departmentId) VALUES (161, 'Project Manager ', 'PROJ_M', '', 4, true, '2026-03-08T11:56:09.470Z', '2026-03-08T12:10:17.408Z', 47);

-- Data for table permissions
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1345, 'leads', 'view', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1346, 'leads', 'view', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1347, 'leads', 'view', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1348, 'leads', 'view', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1349, 'leads', 'create', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1350, 'leads', 'create', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1351, 'leads', 'create', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1352, 'leads', 'create', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1353, 'leads', 'edit', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1354, 'leads', 'edit', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1355, 'leads', 'edit', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1356, 'leads', 'edit', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1357, 'leads', 'delete', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1358, 'leads', 'delete', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1359, 'leads', 'delete', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1360, 'leads', 'delete', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1361, 'leads', 'assign', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1362, 'leads', 'assign', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1363, 'leads', 'assign', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1364, 'leads', 'assign', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1365, 'tasks', 'view', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1366, 'tasks', 'view', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1367, 'tasks', 'view', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1368, 'tasks', 'view', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1369, 'tasks', 'create', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1370, 'tasks', 'create', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1371, 'tasks', 'create', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1372, 'tasks', 'create', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1373, 'tasks', 'edit', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1374, 'tasks', 'edit', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1375, 'tasks', 'edit', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1376, 'tasks', 'edit', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1377, 'tasks', 'delete', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1378, 'tasks', 'delete', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1379, 'tasks', 'delete', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1380, 'tasks', 'delete', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1381, 'tasks', 'assign', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1382, 'tasks', 'assign', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1383, 'tasks', 'assign', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1384, 'tasks', 'assign', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1385, 'projects', 'view', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1386, 'projects', 'view', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1387, 'projects', 'view', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1388, 'projects', 'view', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1389, 'projects', 'create', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1390, 'projects', 'create', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1391, 'projects', 'create', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1392, 'projects', 'create', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1393, 'projects', 'edit', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1394, 'projects', 'edit', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1395, 'projects', 'edit', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1396, 'projects', 'edit', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1397, 'projects', 'delete', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1398, 'projects', 'delete', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1399, 'projects', 'delete', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1400, 'projects', 'delete', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1401, 'products', 'view', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1402, 'products', 'view', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1403, 'products', 'view', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1404, 'products', 'view', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1405, 'products', 'create', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1406, 'products', 'create', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1407, 'products', 'create', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1408, 'products', 'create', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1409, 'products', 'edit', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1410, 'products', 'edit', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1411, 'products', 'edit', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1412, 'products', 'edit', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1413, 'products', 'delete', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1414, 'products', 'delete', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1415, 'products', 'delete', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1416, 'products', 'delete', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1417, 'attendance', 'view', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1418, 'attendance', 'view', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1419, 'attendance', 'view', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1420, 'attendance', 'view', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1421, 'attendance', 'create', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1422, 'attendance', 'create', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1423, 'attendance', 'create', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1424, 'attendance', 'create', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1425, 'attendance', 'approve', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1426, 'attendance', 'approve', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1427, 'attendance', 'approve', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1428, 'attendance', 'approve', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1429, 'leaves', 'view', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1430, 'leaves', 'view', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1431, 'leaves', 'view', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1432, 'leaves', 'view', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1433, 'leaves', 'create', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1434, 'leaves', 'create', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1435, 'leaves', 'create', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1436, 'leaves', 'create', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1437, 'leaves', 'approve', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1438, 'leaves', 'approve', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1439, 'leaves', 'approve', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1440, 'leaves', 'approve', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1441, 'eod', 'view', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1442, 'eod', 'view', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1443, 'eod', 'view', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1444, 'eod', 'view', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1445, 'eod', 'create', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1446, 'eod', 'create', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1447, 'eod', 'create', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1448, 'eod', 'create', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1449, 'eod', 'edit', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1450, 'eod', 'edit', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1451, 'eod', 'edit', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1452, 'eod', 'edit', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1453, 'reports', 'view', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1454, 'reports', 'view', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1455, 'reports', 'view', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1456, 'reports', 'view', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1457, 'reports', 'generate', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1458, 'reports', 'generate', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1459, 'reports', 'generate', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1460, 'reports', 'generate', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1461, 'employees', 'view', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1462, 'employees', 'view', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1463, 'employees', 'view', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1464, 'employees', 'view', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1465, 'employees', 'edit', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1466, 'employees', 'edit', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1467, 'employees', 'edit', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1468, 'employees', 'edit', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1469, 'employees', 'manage', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1470, 'employees', 'manage', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1471, 'employees', 'manage', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1472, 'employees', 'manage', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1473, 'activity', 'view', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1474, 'activity', 'view', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1475, 'activity', 'view', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1476, 'activity', 'view', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1477, 'dashboard', 'view', 'own', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1478, 'dashboard', 'view', 'team', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1479, 'dashboard', 'view', 'department', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');
INSERT INTO permissions (id, module, action, scopeType, description, createdAt, updatedAt) VALUES (1480, 'dashboard', 'view', 'all', NULL, '2026-03-06T09:00:13.909Z', '2026-03-06T09:00:13.909Z');

-- Data for table role_permissions
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9538, 137, 1348, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9539, 137, 1352, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9540, 137, 1356, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9541, 137, 1360, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9542, 137, 1364, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9543, 137, 1368, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9544, 137, 1372, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9545, 137, 1376, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9546, 137, 1380, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9547, 137, 1384, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9548, 137, 1388, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9549, 137, 1404, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9550, 137, 1408, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9551, 137, 1400, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9552, 137, 1396, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9553, 137, 1392, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9554, 137, 1412, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9555, 137, 1416, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9556, 137, 1420, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9557, 137, 1424, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9558, 137, 1428, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9559, 137, 1432, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9560, 137, 1436, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9561, 137, 1440, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9562, 137, 1444, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9563, 137, 1448, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9564, 137, 1452, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9565, 137, 1456, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9566, 137, 1460, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9567, 137, 1464, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9568, 137, 1468, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9569, 137, 1472, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9570, 137, 1476, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9571, 137, 1480, '2026-03-08T12:10:11.154Z', '2026-03-08T12:10:11.154Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9572, 138, 1348, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9573, 138, 1352, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9574, 138, 1355, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9575, 138, 1364, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9576, 138, 1367, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9577, 138, 1371, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9578, 138, 1375, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9579, 138, 1383, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9580, 138, 1419, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9581, 138, 1421, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9582, 138, 1431, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9583, 138, 1433, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9584, 138, 1443, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9585, 138, 1445, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9586, 138, 1455, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9587, 138, 1459, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9588, 138, 1463, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9589, 138, 1475, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9590, 138, 1479, '2026-03-08T12:10:11.575Z', '2026-03-08T12:10:11.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9591, 139, 1345, '2026-03-08T12:10:11.909Z', '2026-03-08T12:10:11.909Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9592, 139, 1349, '2026-03-08T12:10:11.909Z', '2026-03-08T12:10:11.909Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9593, 139, 1353, '2026-03-08T12:10:11.909Z', '2026-03-08T12:10:11.909Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9594, 139, 1361, '2026-03-08T12:10:11.909Z', '2026-03-08T12:10:11.909Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9595, 139, 1365, '2026-03-08T12:10:11.909Z', '2026-03-08T12:10:11.909Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9596, 139, 1417, '2026-03-08T12:10:11.909Z', '2026-03-08T12:10:11.909Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9597, 139, 1421, '2026-03-08T12:10:11.909Z', '2026-03-08T12:10:11.909Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9598, 139, 1429, '2026-03-08T12:10:11.909Z', '2026-03-08T12:10:11.909Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9599, 139, 1433, '2026-03-08T12:10:11.909Z', '2026-03-08T12:10:11.909Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9600, 139, 1441, '2026-03-08T12:10:11.909Z', '2026-03-08T12:10:11.909Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9601, 139, 1445, '2026-03-08T12:10:11.909Z', '2026-03-08T12:10:11.909Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9602, 139, 1453, '2026-03-08T12:10:11.909Z', '2026-03-08T12:10:11.909Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9603, 139, 1473, '2026-03-08T12:10:11.909Z', '2026-03-08T12:10:11.909Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9604, 139, 1477, '2026-03-08T12:10:11.909Z', '2026-03-08T12:10:11.909Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9605, 140, 1346, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9606, 140, 1349, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9607, 140, 1353, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9608, 140, 1362, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9609, 140, 1366, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9610, 140, 1370, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9611, 140, 1382, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9612, 140, 1418, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9613, 140, 1421, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9614, 140, 1430, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9615, 140, 1433, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9616, 140, 1442, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9617, 140, 1445, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9618, 140, 1454, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9619, 140, 1474, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9620, 140, 1478, '2026-03-08T12:10:12.242Z', '2026-03-08T12:10:12.242Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9621, 141, 1347, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9622, 141, 1349, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9623, 141, 1354, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9624, 141, 1363, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9625, 141, 1367, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9626, 141, 1371, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9627, 141, 1382, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9628, 141, 1419, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9629, 141, 1421, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9630, 141, 1431, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9631, 141, 1433, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9632, 141, 1443, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9633, 141, 1445, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9634, 141, 1455, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9635, 141, 1475, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9636, 141, 1479, '2026-03-08T12:10:12.574Z', '2026-03-08T12:10:12.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9637, 142, 1348, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9638, 142, 1352, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9639, 142, 1356, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9640, 142, 1360, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9641, 142, 1364, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9642, 142, 1368, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9643, 142, 1372, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9644, 142, 1376, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9645, 142, 1380, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9646, 142, 1384, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9647, 142, 1388, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9648, 142, 1392, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9649, 142, 1396, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9650, 142, 1400, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9651, 142, 1404, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9652, 142, 1408, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9653, 142, 1412, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9654, 142, 1416, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9655, 142, 1420, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9656, 142, 1424, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9657, 142, 1428, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9658, 142, 1432, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9659, 142, 1436, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9660, 142, 1440, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9661, 142, 1444, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9662, 142, 1448, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9663, 142, 1452, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9664, 142, 1456, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9665, 142, 1460, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9666, 142, 1464, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9667, 142, 1468, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9668, 142, 1472, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9669, 142, 1476, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9670, 142, 1480, '2026-03-08T12:10:12.907Z', '2026-03-08T12:10:12.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9671, 143, 1345, '2026-03-08T12:10:13.241Z', '2026-03-08T12:10:13.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9672, 143, 1349, '2026-03-08T12:10:13.241Z', '2026-03-08T12:10:13.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9673, 143, 1353, '2026-03-08T12:10:13.241Z', '2026-03-08T12:10:13.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9674, 143, 1361, '2026-03-08T12:10:13.241Z', '2026-03-08T12:10:13.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9675, 143, 1365, '2026-03-08T12:10:13.241Z', '2026-03-08T12:10:13.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9676, 143, 1417, '2026-03-08T12:10:13.241Z', '2026-03-08T12:10:13.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9677, 143, 1421, '2026-03-08T12:10:13.241Z', '2026-03-08T12:10:13.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9678, 143, 1429, '2026-03-08T12:10:13.241Z', '2026-03-08T12:10:13.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9679, 143, 1433, '2026-03-08T12:10:13.241Z', '2026-03-08T12:10:13.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9680, 143, 1441, '2026-03-08T12:10:13.241Z', '2026-03-08T12:10:13.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9681, 143, 1445, '2026-03-08T12:10:13.241Z', '2026-03-08T12:10:13.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9682, 143, 1453, '2026-03-08T12:10:13.241Z', '2026-03-08T12:10:13.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9683, 143, 1473, '2026-03-08T12:10:13.241Z', '2026-03-08T12:10:13.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9684, 143, 1477, '2026-03-08T12:10:13.241Z', '2026-03-08T12:10:13.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9685, 145, 1345, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9686, 145, 1349, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9687, 145, 1404, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9688, 145, 1408, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9689, 145, 1420, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9690, 145, 1421, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9691, 145, 1432, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9692, 145, 1433, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9693, 145, 1444, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9694, 145, 1445, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9695, 145, 1361, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9696, 145, 1367, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9697, 145, 1371, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9698, 145, 1375, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9699, 145, 1388, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9700, 145, 1392, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9701, 145, 1456, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9702, 145, 1460, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9703, 145, 1464, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9704, 145, 1477, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9705, 145, 1383, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9706, 145, 1476, '2026-03-08T12:10:13.574Z', '2026-03-08T12:10:13.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9707, 147, 1345, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9708, 147, 1349, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9709, 147, 1361, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9710, 147, 1367, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9711, 147, 1371, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9712, 147, 1375, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9713, 147, 1383, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9714, 147, 1387, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9715, 147, 1391, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9716, 147, 1395, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9717, 147, 1403, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9718, 147, 1407, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9719, 147, 1411, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9720, 147, 1419, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9721, 147, 1431, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9722, 147, 1433, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9723, 147, 1421, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9724, 147, 1443, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9725, 147, 1445, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9726, 147, 1455, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9727, 147, 1459, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9728, 147, 1463, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9729, 147, 1475, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9730, 147, 1479, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9731, 147, 1377, '2026-03-08T12:10:13.908Z', '2026-03-08T12:10:13.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9732, 148, 1365, '2026-03-08T12:10:14.241Z', '2026-03-08T12:10:14.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9733, 148, 1385, '2026-03-08T12:10:14.241Z', '2026-03-08T12:10:14.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9734, 148, 1401, '2026-03-08T12:10:14.241Z', '2026-03-08T12:10:14.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9735, 148, 1417, '2026-03-08T12:10:14.241Z', '2026-03-08T12:10:14.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9736, 148, 1421, '2026-03-08T12:10:14.241Z', '2026-03-08T12:10:14.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9737, 148, 1429, '2026-03-08T12:10:14.241Z', '2026-03-08T12:10:14.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9738, 148, 1433, '2026-03-08T12:10:14.241Z', '2026-03-08T12:10:14.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9739, 148, 1441, '2026-03-08T12:10:14.241Z', '2026-03-08T12:10:14.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9740, 148, 1445, '2026-03-08T12:10:14.241Z', '2026-03-08T12:10:14.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9741, 148, 1453, '2026-03-08T12:10:14.241Z', '2026-03-08T12:10:14.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9742, 148, 1473, '2026-03-08T12:10:14.241Z', '2026-03-08T12:10:14.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9743, 148, 1477, '2026-03-08T12:10:14.241Z', '2026-03-08T12:10:14.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9744, 148, 1373, '2026-03-08T12:10:14.241Z', '2026-03-08T12:10:14.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9745, 148, 1369, '2026-03-08T12:10:14.241Z', '2026-03-08T12:10:14.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9746, 148, 1377, '2026-03-08T12:10:14.241Z', '2026-03-08T12:10:14.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9747, 149, 1367, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9748, 149, 1371, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9749, 149, 1383, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9750, 149, 1403, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9751, 149, 1407, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9752, 149, 1411, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9753, 149, 1419, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9754, 149, 1421, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9755, 149, 1431, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9756, 149, 1433, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9757, 149, 1443, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9758, 149, 1445, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9759, 149, 1455, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9760, 149, 1459, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9761, 149, 1463, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9762, 149, 1475, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9763, 149, 1479, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9764, 149, 1373, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9765, 149, 1377, '2026-03-08T12:10:14.574Z', '2026-03-08T12:10:14.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9766, 150, 1366, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9767, 150, 1370, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9768, 150, 1382, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9769, 150, 1402, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9770, 150, 1418, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9771, 150, 1421, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9772, 150, 1430, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9773, 150, 1433, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9774, 150, 1442, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9775, 150, 1445, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9776, 150, 1454, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9777, 150, 1462, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9778, 150, 1474, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9779, 150, 1478, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9780, 150, 1377, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9781, 150, 1373, '2026-03-08T12:10:14.908Z', '2026-03-08T12:10:14.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9782, 151, 1365, '2026-03-08T12:10:15.241Z', '2026-03-08T12:10:15.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9783, 151, 1401, '2026-03-08T12:10:15.241Z', '2026-03-08T12:10:15.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9784, 151, 1417, '2026-03-08T12:10:15.241Z', '2026-03-08T12:10:15.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9785, 151, 1421, '2026-03-08T12:10:15.241Z', '2026-03-08T12:10:15.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9786, 151, 1429, '2026-03-08T12:10:15.241Z', '2026-03-08T12:10:15.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9787, 151, 1433, '2026-03-08T12:10:15.241Z', '2026-03-08T12:10:15.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9788, 151, 1441, '2026-03-08T12:10:15.241Z', '2026-03-08T12:10:15.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9789, 151, 1445, '2026-03-08T12:10:15.241Z', '2026-03-08T12:10:15.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9790, 151, 1453, '2026-03-08T12:10:15.241Z', '2026-03-08T12:10:15.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9791, 151, 1473, '2026-03-08T12:10:15.241Z', '2026-03-08T12:10:15.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9792, 151, 1477, '2026-03-08T12:10:15.241Z', '2026-03-08T12:10:15.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9793, 151, 1369, '2026-03-08T12:10:15.241Z', '2026-03-08T12:10:15.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9794, 151, 1373, '2026-03-08T12:10:15.241Z', '2026-03-08T12:10:15.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9795, 151, 1377, '2026-03-08T12:10:15.241Z', '2026-03-08T12:10:15.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9796, 152, 1365, '2026-03-08T12:10:15.575Z', '2026-03-08T12:10:15.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9797, 152, 1385, '2026-03-08T12:10:15.575Z', '2026-03-08T12:10:15.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9798, 152, 1401, '2026-03-08T12:10:15.575Z', '2026-03-08T12:10:15.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9799, 152, 1417, '2026-03-08T12:10:15.575Z', '2026-03-08T12:10:15.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9800, 152, 1421, '2026-03-08T12:10:15.575Z', '2026-03-08T12:10:15.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9801, 152, 1429, '2026-03-08T12:10:15.575Z', '2026-03-08T12:10:15.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9802, 152, 1433, '2026-03-08T12:10:15.575Z', '2026-03-08T12:10:15.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9803, 152, 1441, '2026-03-08T12:10:15.575Z', '2026-03-08T12:10:15.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9804, 152, 1445, '2026-03-08T12:10:15.575Z', '2026-03-08T12:10:15.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9805, 152, 1453, '2026-03-08T12:10:15.575Z', '2026-03-08T12:10:15.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9806, 152, 1473, '2026-03-08T12:10:15.575Z', '2026-03-08T12:10:15.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9807, 152, 1477, '2026-03-08T12:10:15.575Z', '2026-03-08T12:10:15.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9808, 152, 1373, '2026-03-08T12:10:15.575Z', '2026-03-08T12:10:15.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9809, 152, 1369, '2026-03-08T12:10:15.575Z', '2026-03-08T12:10:15.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9810, 152, 1377, '2026-03-08T12:10:15.575Z', '2026-03-08T12:10:15.575Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9811, 153, 1365, '2026-03-08T12:10:15.908Z', '2026-03-08T12:10:15.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9812, 153, 1369, '2026-03-08T12:10:15.908Z', '2026-03-08T12:10:15.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9813, 153, 1373, '2026-03-08T12:10:15.908Z', '2026-03-08T12:10:15.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9814, 153, 1377, '2026-03-08T12:10:15.908Z', '2026-03-08T12:10:15.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9815, 153, 1401, '2026-03-08T12:10:15.908Z', '2026-03-08T12:10:15.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9816, 153, 1417, '2026-03-08T12:10:15.908Z', '2026-03-08T12:10:15.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9817, 153, 1421, '2026-03-08T12:10:15.908Z', '2026-03-08T12:10:15.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9818, 153, 1429, '2026-03-08T12:10:15.908Z', '2026-03-08T12:10:15.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9819, 153, 1433, '2026-03-08T12:10:15.908Z', '2026-03-08T12:10:15.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9820, 153, 1441, '2026-03-08T12:10:15.908Z', '2026-03-08T12:10:15.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9821, 153, 1445, '2026-03-08T12:10:15.908Z', '2026-03-08T12:10:15.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9822, 153, 1453, '2026-03-08T12:10:15.908Z', '2026-03-08T12:10:15.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9823, 153, 1473, '2026-03-08T12:10:15.908Z', '2026-03-08T12:10:15.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9824, 153, 1477, '2026-03-08T12:10:15.908Z', '2026-03-08T12:10:15.908Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9825, 154, 1365, '2026-03-08T12:10:16.241Z', '2026-03-08T12:10:16.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9826, 154, 1373, '2026-03-08T12:10:16.241Z', '2026-03-08T12:10:16.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9827, 154, 1369, '2026-03-08T12:10:16.241Z', '2026-03-08T12:10:16.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9828, 154, 1377, '2026-03-08T12:10:16.241Z', '2026-03-08T12:10:16.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9829, 154, 1385, '2026-03-08T12:10:16.241Z', '2026-03-08T12:10:16.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9830, 154, 1401, '2026-03-08T12:10:16.241Z', '2026-03-08T12:10:16.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9831, 154, 1417, '2026-03-08T12:10:16.241Z', '2026-03-08T12:10:16.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9832, 154, 1421, '2026-03-08T12:10:16.241Z', '2026-03-08T12:10:16.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9833, 154, 1429, '2026-03-08T12:10:16.241Z', '2026-03-08T12:10:16.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9834, 154, 1433, '2026-03-08T12:10:16.241Z', '2026-03-08T12:10:16.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9835, 154, 1441, '2026-03-08T12:10:16.241Z', '2026-03-08T12:10:16.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9836, 154, 1445, '2026-03-08T12:10:16.241Z', '2026-03-08T12:10:16.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9837, 154, 1453, '2026-03-08T12:10:16.241Z', '2026-03-08T12:10:16.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9838, 154, 1473, '2026-03-08T12:10:16.241Z', '2026-03-08T12:10:16.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9839, 154, 1477, '2026-03-08T12:10:16.241Z', '2026-03-08T12:10:16.241Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9840, 157, 1365, '2026-03-08T12:10:16.574Z', '2026-03-08T12:10:16.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9841, 157, 1373, '2026-03-08T12:10:16.574Z', '2026-03-08T12:10:16.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9842, 157, 1369, '2026-03-08T12:10:16.574Z', '2026-03-08T12:10:16.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9843, 157, 1377, '2026-03-08T12:10:16.574Z', '2026-03-08T12:10:16.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9844, 157, 1385, '2026-03-08T12:10:16.574Z', '2026-03-08T12:10:16.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9845, 157, 1401, '2026-03-08T12:10:16.574Z', '2026-03-08T12:10:16.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9846, 157, 1417, '2026-03-08T12:10:16.574Z', '2026-03-08T12:10:16.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9847, 157, 1421, '2026-03-08T12:10:16.574Z', '2026-03-08T12:10:16.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9848, 157, 1429, '2026-03-08T12:10:16.574Z', '2026-03-08T12:10:16.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9849, 157, 1433, '2026-03-08T12:10:16.574Z', '2026-03-08T12:10:16.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9850, 157, 1441, '2026-03-08T12:10:16.574Z', '2026-03-08T12:10:16.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9851, 157, 1445, '2026-03-08T12:10:16.574Z', '2026-03-08T12:10:16.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9852, 157, 1453, '2026-03-08T12:10:16.574Z', '2026-03-08T12:10:16.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9853, 157, 1473, '2026-03-08T12:10:16.574Z', '2026-03-08T12:10:16.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9854, 157, 1477, '2026-03-08T12:10:16.574Z', '2026-03-08T12:10:16.574Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9855, 158, 1368, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9856, 158, 1370, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9857, 158, 1382, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9858, 158, 1388, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9859, 158, 1404, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9860, 158, 1420, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9861, 158, 1421, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9862, 158, 1428, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9863, 158, 1432, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9864, 158, 1433, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9865, 158, 1440, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9866, 158, 1444, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9867, 158, 1445, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9868, 158, 1456, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9869, 158, 1460, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9870, 158, 1464, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9871, 158, 1468, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9872, 158, 1472, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9873, 158, 1476, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');
INSERT INTO role_permissions (id, roleId, permissionId, createdAt, updatedAt) VALUES (9874, 158, 1480, '2026-03-08T12:10:16.907Z', '2026-03-08T12:10:16.907Z');

-- Data for table users
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (285, 'danish@gmail.com', '$2b$10$2tJIg/Nr8ZVl1utmci/HnOPwxZcd0LbtvXfkV1J0t/LkjvL0twp8G', true, '2026-03-06T20:39:10.041Z', '2026-03-06T20:39:10.041Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (286, 'alfazb@gmail.com', '$2b$10$xv6Fs5qFgYTPhqugPPITWu4hPvUhNiYf9H1Jj9ShuzIBftR/2k31C', true, '2026-03-06T20:45:28.441Z', '2026-03-06T20:45:28.441Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (287, 'dhanashreeT@gmail.com', '$2b$10$ldbvd79LmAERRH8Aur9yWeaDy7WO5mAXH9ywQk6dECHoNXEtv9qze', true, '2026-03-06T20:56:24.941Z', '2026-03-06T20:56:24.941Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (288, 'darshraj@gmail.com', '$2b$10$kWm4agColyGjNnJuragDFOHAODF2wl1id/YT2zsJGYYSB3D0Jscz6', true, '2026-03-06T21:00:45.143Z', '2026-03-06T21:00:45.143Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (289, 'bhargavmg@gmail.com', '$2b$10$BdJlrfmqU9IpkPjSCGQLPOMCaf4hfsfT47PQwHck9XmtQJOkr0Uha', true, '2026-03-06T21:31:32.543Z', '2026-03-06T21:31:52.601Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (290, 'shubham748856@gmail.com', '$2b$10$TDnhRrmjf6FGAaR5BFD1leMIPad5UK8Ii5X2Lt6Fhcrzjcxq65BfO', true, '2026-03-08T11:45:11.344Z', '2026-03-08T11:45:11.344Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (291, 'dadhaniyaaneri@gmail.com', '$2b$10$kClXiWRoT0domWxACwmeUeuqSEyUGva766SOaiY5crPkTSoetchX2', true, '2026-03-08T11:48:31.942Z', '2026-03-08T11:48:31.942Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (292, 'manishatejvani26@gmail.com', '$2b$10$1GHwW.VCKj4/FC9sMZRdEOGKXwpZ3s1KV9loD.PLZT8kLNxxAoSRK', true, '2026-03-08T11:49:11.042Z', '2026-03-08T11:49:11.042Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (294, 'dhanashri.k0409@gmail.com', '$2b$10$ppWbJJbbgRXWgVePH2Hvx.0MirnI8bYp9svHkctqRTu0dKSxSCU8W', true, '2026-03-08T11:50:15.642Z', '2026-03-08T11:50:15.642Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (295, 'raviparmar11102001@gmail.com', '$2b$10$3QlcjWTN4yhs6HJUcJt/3OoZgurTBXIM8VIdBYZmbLlbtbmv.VqrG', true, '2026-03-08T11:51:37.840Z', '2026-03-08T11:51:37.840Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (297, 'jaiswaltanu1705@gmail.com', '$2b$10$OLAnmvDmWW0NXPXqPnWTJ.kS1FCeSkOolh5laHuzeKTKwcLHt6fH2', true, '2026-03-08T11:57:44.741Z', '2026-03-08T11:57:44.741Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (282, 'parmarakshat23@gmail.com', '$2b$10$ttaQvICzUoEOydH8Xc4EtukcYV30mUNNChybl80Ca4s.tkUUxOVem', true, '2026-03-06T10:26:31.042Z', '2026-03-08T12:15:47.676Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (296, 'hanshika12004@gmail.com', '$2b$10$YqSXRQVGbEBc6sCvKiH3SO74vVPJA3IIsNONUQoS88bgl/JBUpDTq', true, '2026-03-08T11:52:35.543Z', '2026-03-09T08:44:54.698Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (293, 'shreyakhedkar06@gmail.com', '$2b$10$C.1162LPslKWpKR.eUph4OOqJLjjgOeh7u0Ky8tfwIYsRExzg1sHO', true, '2026-03-08T11:49:41.037Z', '2026-03-09T08:46:45.346Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (279, 'mediaamasala@gmail.com', '$2b$10$jvwDI0YAQ0fqgVmyyODl4.GZ.mR/cbJ8gsnSSX0Rw3zEAmpTeq.3q', true, '2026-03-06T09:00:19.246Z', '2026-03-06T09:00:19.246Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (281, 'kiranchoudhary5931@gmail.com', '$2b$10$EXb3r.J6TdeazzAblUARUeSzkXgK55Db5BsUl.U7mG/Jl3YElk2S.', true, '2026-03-06T10:22:04.541Z', '2026-03-06T10:22:04.541Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (280, 'rpdesigner36@gmail.com', '$2b$10$4QW3K5UCswhrZp/95PwfjeysTrKKpMcR2iMqHuWQ5TzMl5gly8wGu', true, '2026-03-06T10:18:43.543Z', '2026-03-06T12:43:23.933Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (283, 'krishishah@gmail.com', '$2b$10$bU7DI7sT9VgGv6Vi.trKO.kefAdkIKVYvBSuCsRYMjg3fElWxpPjG', true, '2026-03-06T12:44:58.344Z', '2026-03-06T12:51:40.086Z');
INSERT INTO users (id, email, passwordHash, isActive, createdAt, updatedAt) VALUES (284, 'shifagodil07@gmail.com', '$2b$10$ffGXrL7H2aXfjdZuusTEbOHACAy32QqrrvvxfUdYXAxAsQf8VgxAu', true, '2026-03-06T19:21:31.245Z', '2026-03-06T19:21:31.245Z');

-- Data for table employees
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (285, 'EMP007', 285, 'Danish ', 'Parmar ', 'danish@gmail.com', '', 44, 148, 283, NULL, true, '2026-03-06T20:39:10.229Z', '2026-03-06T20:39:10.229Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (286, 'EMP008', 286, 'Alfaz', 'Bilakhiya', 'alfazb@gmail.com', '', 43, 151, NULL, NULL, true, '2026-03-06T20:45:28.597Z', '2026-03-06T20:45:28.597Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (287, 'EMP009', 287, 'Dhanashree ', 'Trambadiya', 'dhanashreeT@gmail.com', '', 43, 151, NULL, NULL, true, '2026-03-06T20:56:25.123Z', '2026-03-06T20:56:25.123Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (288, 'EMP010', 288, 'Darshraj', 'A', 'darshraj@gmail.com', '', 42, 139, 281, NULL, true, '2026-03-06T21:00:45.320Z', '2026-03-06T21:00:45.320Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (289, 'EMP011', 289, 'Bhargav', 'Gohel ', 'bhargavmg@gmail.com', '', 43, 150, NULL, NULL, true, '2026-03-06T21:31:32.705Z', '2026-03-06T21:31:52.218Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (291, 'EMP012', 290, 'Shubham', 'Raj ', 'shubham748856@gmail.com', '', 43, 153, 289, NULL, true, '2026-03-08T11:45:11.508Z', '2026-03-08T11:45:11.508Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (292, 'EMP013', 291, 'Aneri', 'Dadhaniya ', 'dadhaniyaaneri@gmail.com', '', 44, 154, 283, NULL, true, '2026-03-08T11:48:32.095Z', '2026-03-08T11:48:32.095Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (293, 'EMP014', 292, 'Manisha ', 'Tejvani', 'manishatejvani26@gmail.com', '', 44, 154, 283, NULL, true, '2026-03-08T11:49:11.198Z', '2026-03-08T11:49:11.198Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (295, 'EMP016', 294, 'Dhanashri ', 'Kadam', 'dhanashri.k0409@gmail.com', '', 44, 154, 283, NULL, true, '2026-03-08T11:50:15.929Z', '2026-03-08T11:50:15.929Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (296, 'EMP017', 295, 'Ravi ', 'parmar', 'raviparmar11102001@gmail.com', '', 41, 158, 282, NULL, true, '2026-03-08T11:51:37.918Z', '2026-03-08T11:51:37.918Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (298, 'EMP019', 297, 'Tanu ', 'Jaiswal ', 'jaiswaltanu1705@gmail.com', '', 47, 161, NULL, NULL, true, '2026-03-08T11:57:44.899Z', '2026-03-08T11:57:44.899Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (282, 'EMP004', 282, 'Akshat ', 'Parmar', 'parmarakshat23@gmail.com', '', 41, 137, 279, NULL, true, '2026-03-06T10:26:31.213Z', '2026-03-08T12:15:47.518Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (297, 'EMP018', 296, 'Hanshika', 'Singh', 'hanshika12004@gmail.com', '', 44, 154, 283, NULL, true, '2026-03-08T11:52:35.622Z', '2026-03-09T08:44:54.532Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (294, 'EMP015', 293, 'Shreya ', 'Khedkar', 'shreyakhedkar06@gmail.com', '', 44, 154, 283, NULL, true, '2026-03-08T11:49:41.114Z', '2026-03-09T08:46:45.191Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (279, 'EMP001', 279, 'Mediaa', 'Masala', 'mediaamasala@gmail.com', NULL, 41, 137, NULL, NULL, true, '2026-03-06T09:00:19.871Z', '2026-03-06T09:00:19.871Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (281, 'EMP003', 281, 'Kiran ', 'Choudhary', 'kiranchoudhary5931@gmail.com', '', 42, 143, NULL, NULL, true, '2026-03-06T10:22:04.708Z', '2026-03-06T10:22:04.708Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (280, 'EMP002', 280, 'Rashmi ', 'Parmar', 'rpdesigner36@gmail.com', '', 46, 145, NULL, NULL, true, '2026-03-06T10:18:43.733Z', '2026-03-06T12:43:23.774Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (283, 'EMP005', 283, 'Krishi ', 'Shah', 'krishishah@gmail.com', '', 44, 147, NULL, NULL, true, '2026-03-06T12:44:58.501Z', '2026-03-06T12:51:39.928Z');
INSERT INTO employees (id, empId, userId, firstName, lastName, email, phone, departmentId, roleId, managerId, joiningDate, isActive, createdAt, updatedAt) VALUES (284, 'EMP006', 284, 'Alshifa', 'Godil  ', 'shifagodil07@gmail.com', '', 44, 148, 283, NULL, true, '2026-03-06T19:21:31.411Z', '2026-03-06T19:21:31.411Z');

-- Data for table leads
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('cda27d9a-a412-43e9-b17a-dda50d3a4e02', 'fulchand parmar', 'testu1@gmail.com', '9638550005', 'the fortune cafe restaurant', 'Cold_Call', 'New', '9638550005- fulchand parmar owner
9714006565- jitendrasinh cashier
Banaskatha- the fortune cafe restaurant
They want demo online through Any desk', 280, 42, NULL, '2026-03-06T11:17:56.060Z', '2026-03-06T11:17:56.060Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('301a9dd9-dfec-4d80-acf1-145b29f63b9d', 'abc', 'testu2@gmail.com', '9924697608', 'SAHYOG SAGAR RESTAURANT	', 'Cold_Call', 'New', 'call back+interested+details wp	', 280, 42, NULL, '2026-03-06T11:20:19.849Z', '2026-03-06T11:20:19.849Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('5655d044-025e-4258-bdbe-da9ee828ca38', 'Farukbhai', 'test3@gmail.com', '8980001930', 'SORATH MAHAL RESTAURANT	', 'Cold_Call', 'New', '6.SORATH MAHAL RESTAURANT	
farukhbhai no need but detail wp	
8980001930
https://maps.app.goo.gl/pTRq5KgtzUZiN8fQ6
', 280, 42, NULL, '2026-03-06T11:21:57.802Z', '2026-03-06T11:21:57.802Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('7f998dcb-51f1-429b-858c-dbe3c21946b4', 'Hirenbhai', 'test4@gmail.com', '8866680907', 'Shivam Restaurant	', 'Cold_Call', 'New', '5.Shivam Restaurant	
8866680907-wp-hirenbhai(virenbhai owner)+ Interested+ Want details	9099902233	
https://maps.app.goo.gl/xiYGBQWMsJaYi7Gu8	https://www.instagram.com/shivam_restaurante?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==
', 280, 42, NULL, '2026-03-06T11:22:52.191Z', '2026-03-06T11:22:52.191Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('0c7753ff-595a-4b80-b6cd-09bfed95156e', 'Mayank', 'test5@gail.com', '7096702676', 'Madhav Hotel	', 'Cold_Call', 'New', 'Madhav Hotel	
mayank- Call 5 today to talk with owner or wp details	
7096702676	
https://maps.app.goo.gl/bXPDzad43LX1G8gm9
', 280, 42, NULL, '2026-03-06T11:24:06.094Z', '2026-03-06T11:24:06.094Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('26fd08f5-559c-4868-9c93-819bc6060184', 'abcd', 'test6@gmail.com', '7926574892', 'Pleasure Trove', 'Cold_Call', 'New', 'Pleasure Trove	
want details+ owner not available	
7926574892
https://share.google/ujziUwgMnBSVJT9E1	', 280, 42, NULL, '2026-03-06T11:24:58.330Z', '2026-03-06T11:24:58.330Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('3ae5f0e7-37c7-49a9-9afd-6997396d1472', 'Sundarraj', 'test7@gmail.com', '8238385888', 'Raghav Restaurant & Banquet	', 'Cold_Call', 'New', '2.Raghav Restaurant & Banquet	
Sundarraj+interested+want details	
8238385888
https://share.google/7V71xvOvSqivSciuO
', 280, 42, NULL, '2026-03-06T11:25:58.471Z', '2026-03-06T11:25:58.471Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('56720030-0cd6-4787-bbf9-9e41a36b8583', 'Mansurali Khan', 'test8@gmail.com', '9924811440', 'Shaahana Restaurant & Banquet	', 'Cold_Call', 'New', '1.Shaahana Restaurant & Banquet	
Mansurali Khan-Interested+want details 	
9924811440
https://share.google/pKeR7NSOjTcDrenxt
', 280, 42, NULL, '2026-03-06T11:27:30.081Z', '2026-03-06T11:27:30.081Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('4cbd0069-a31e-4fb9-8615-6e744fc5921b', 'abec', 'test9@gmail.com', '070163 10619', 'Virasat-E-Curry Panjrapole', 'Cold_Call', 'New', 'Virasat-E-Curry Panjrapole | Vegetarian North Indian & Punjabi Restaurant in Ahmedabad
070163 10619
https://share.google/LvezFgrPd5fgFRj1K
Busy', 280, 42, NULL, '2026-03-06T11:29:02.806Z', '2026-03-06T11:29:02.806Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('ab28ae72-77e0-4885-a3b9-b4351429dfad', 'abcde', 'test10@gmail.com', '07926408200', 'Jungle Bhookh Restaurant', 'Cold_Call', 'New', 'Jungle Bhookh Restaurant
07926408200
https://share.google/74D56r1glvwh4srDe
Deny but details wp', 280, 42, NULL, '2026-03-06T11:32:40.673Z', '2026-03-06T11:32:40.673Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('ecd48d9f-30d4-49f6-b1ab-517c3df489a7', 'Dilip', 'test11@gmail.com', '9145586777', 'King’s Kraft Tremezzo Inn	', 'Cold_Call', 'New', '8.King’s Kraft Tremezzo Inn	
dilip-Interested+demo	
9145586777
https://maps.app.goo.gl/DvRF7XUhYDCmQGs56
https://www.kingskraft.com/hotel/king-s-kraft-tremezzo-inn', 280, 42, NULL, '2026-03-06T11:41:25.378Z', '2026-03-06T11:41:25.378Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('10238c7f-704b-48b5-b112-7d83623b856d', 'Santosh', 'test12@gmail.com', '9904468855', 'The Grand Astoria Somnath	', 'Cold_Call', 'New', '7.The Grand Astoria Somnath	
santosh+interested+want details	
9904468855
https://maps.app.goo.gl/KyBLbVocJGVUVspC7
', 280, 42, NULL, '2026-03-06T11:42:34.624Z', '2026-03-06T11:42:34.624Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('42f62bf2-3fb3-4b83-84fd-12d9a6bd4f97', 'Rakesh', 'test13@gmail.com', '9327794688', 'Hotel Satkar Veraval Somnath	', 'Cold_Call', 'New', 'Hotel Satkar Veraval Somnath	-2876220120	
manager Rakesh number given+Interested+want details	https://maps.app.goo.gl/yoobDVYYECDxJwo78
http://www.satkarhotel.in/	
Rakesh-9327794688', 280, 42, NULL, '2026-03-06T11:44:05.472Z', '2026-03-06T11:44:05.472Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('23d93d2e-3616-400d-9166-de2682a8adb2', 'urvashi', 'test14@gmail.com', '9033067168', 'Ekansh Hotels And Resorts', 'Cold_Call', 'New', 'Ekansh Hotels And Resorts-9033067168
urvashi-purchse manager not available+want details
https://maps.app.goo.gl/FAMri5szKwmukCLt9	
https://www.ekanshhotelsandresorts.com/', 280, 42, NULL, '2026-03-06T11:45:32.528Z', '2026-03-06T11:45:32.528Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('b4ab6b3a-0895-4036-ab82-24bffc26e214', 'Sanjay', 'test15@gmail.com', '7202822111', 'Hotel Shlok Inn', 'Cold_Call', 'New', 'Hotel Shlok Inn
Sanjay(Restaurant in Past)+Interested+want details
7202822111	
https://maps.app.goo.gl/3ZDbe7AqHdNnwu9d8																						
', 280, 42, NULL, '2026-03-06T12:19:49.893Z', '2026-03-06T12:19:49.893Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('3661581e-7a75-4aa0-a49f-c08933eb4789', 'Mandeep', 'test16@gmail.com', '9909801774', 'Hotel The Grand Daksh Mansingh Inn Somnath', 'Cold_Call', 'New', 'Hotel The Grand Daksh Mansingh Inn Somnath	Mandeep(detais WP)	
9909801774	
https://maps.app.goo.gl/PT8bUFkJQUqnsVcG8
http://www.thegranddaksh.com/																					', 280, 42, NULL, '2026-03-06T12:22:26.706Z', '2026-03-06T12:22:26.706Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('cedf9e1d-9632-4e9c-832c-0b19a7befd0a', 'Harsh', 'test17@gmail.com', '7359966000', 'Hotel Sunshine inn Somnath	', 'Cold_Call', 'New', '2.Hotel Sunshine inn Somnath	
Harsh(want details)	
7359966000
https://maps.app.goo.gl/obc1hx6Lu7nbyjvp6
https://www.hotelsunshineinn.com/', 280, 42, NULL, '2026-03-06T12:23:40.401Z', '2026-03-06T12:23:40.401Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('a287f8f8-6363-4816-8dfa-49ac40077afc', 'Asfa', 'test18@gmail.com', '9054505466', 'Hotel Scintilla	', 'Cold_Call', 'New', 'Hotel Scintilla	
afsa (details wp) Good 	
9054505466
https://maps.app.goo.gl/Vpfv8WspytPK4bKb9', 280, 42, NULL, '2026-03-06T12:29:13.952Z', '2026-03-06T12:29:13.952Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('1e0536c4-b3cd-4013-b976-f7f36488571e', 'Madanji', 'test19@gmail.com', '070460 35079', 'Aagrah Restaurant', 'Cold_Call', 'New', 'Aagrah Restaurant
Phone: 070460 35079
https://share.google/7iYKqLn4J5FGhFOl6
Interested+want details
Madanji', 280, 42, NULL, '2026-03-06T12:34:58.078Z', '2026-03-06T12:34:58.078Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('e14e6557-1606-45e5-b4dd-f27d06d4624c', 'abcdef', 'test20@gmail.com', '89805 73415', 'Brewers coffe bar', 'Cold_Call', 'New', '+91 89805 73415
brewers coffe bar- Bhavnagar
Meeting Tomorrow
need product activation 7 day trial', 280, 42, NULL, '2026-03-06T12:36:50.577Z', '2026-03-06T12:36:50.577Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('9e3e8607-dd50-45c9-b57b-b04d38f56eca', 'xyz', 'test21@gmail.com', '8140814377', 'Rotli multicuiine restaurant', 'Cold_Call', 'New', '+91 81408 14377
Rotli multicuiine restaurant
want demo 7 days free trial today
Rajkot', 280, 42, NULL, '2026-03-06T12:38:25.317Z', '2026-03-06T12:38:25.317Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('2f6b3684-f867-4a7f-8685-fd9cce6d2865', 'Yunusbhai', 'test22@gmail.com', '9904020612', 'Bharosa Fast food', 'Cold_Call', 'New', 'Meeting: Dashraj
Deal done ', 280, 46, NULL, '2026-03-07T06:03:23.137Z', '2026-03-07T06:03:23.137Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('02449459-324a-441a-8445-70661e61409b', 'user', 'test23@gmail.com', '08140825825', 'Lil'' Heaven', 'Cold_Call', 'New', 'Meeting: Kiran ma''am
Client done 
Ai menu system', 280, 46, NULL, '2026-03-07T06:20:35.436Z', '2026-03-07T06:20:35.436Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('036983a6-a489-4c44-aac7-3365f47c8422', 'Neel Patel', 'kiranchoudhary5931@gmail.com', '+91 95582 21390', 'Jor Shor Restaurant and Banquet', 'Cold_Call', 'New', 'Cb for re-schedule meeting', 281, 42, NULL, '2026-03-07T06:51:42.098Z', '2026-03-07T06:51:42.098Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('4bbc0d39-8912-48f4-ab02-4d8dd52fc0cb', 'user1', 'test24@gmail.com', '7046560560', 'Brick Kitchen', 'Cold_Call', 'New', 'Brick Kitchen
7046560560
https://share.google/EHOOyIDwB8QrWNnBj
Deny (wp)', 280, 46, NULL, '2026-03-07T10:40:35.980Z', '2026-03-07T10:40:35.980Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('5ccda9a9-2f24-4989-a626-7b8e6921d3c3', 'PD gohil', 'test25@gmail.com', '9081636399', 'Hotel Orchid Prime', 'Cold_Call', 'New', 'Hotel Orchid Prime	
https://maps.app.goo.gl/o1gxxHy95qHuHjJq9		
Bhavnagar	
9081636399	
Call today 5 PM – Owner PD Gohil(7284844384)	
Positive less interested+ demo and details
11AM meeting fixed', 280, 46, NULL, '2026-03-07T10:42:14.145Z', '2026-03-07T10:42:14.145Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('692b56f3-1293-41ba-951b-10229ae4ecdc', 'Ghanshyam thakkar', 'test26@gmail.com', '9727282700', 'Raghuvanshi thal ', 'Cold_Call', 'New', 'https://share.google/SLT1NaKkjcaPmqdj2
Ghanshyam thakkar- raghuvanshi thal 
9727282700
Interested+ want details', 280, 46, NULL, '2026-03-07T10:43:17.145Z', '2026-03-07T10:43:17.145Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('e7d8ee5f-fd1d-4912-87be-727184021b76', 'user2', 'test27@gmail.com', '9336000066 ', 'Aristo cafe', 'Cold_Call', 'New', '9336000066 
Aristo cafe
Ahmedabad
', 280, 46, NULL, '2026-03-07T10:45:04.928Z', '2026-03-07T10:45:04.928Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('212482c6-58bf-4f50-a9ab-9dbd3024d864', 'DR Rana', 'test28@gmail.com', '9377111800', 'Food Bose', 'Referral', 'New', 'Food Bose- DR RANA(Ref by Riddhi ma''am) 9377111800', 280, 46, NULL, '2026-03-07T10:46:15.439Z', '2026-03-07T10:46:15.439Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('b3f97cb7-caa2-4069-8c17-c11e1d37fa09', 'Himanshubhai', 'test29@gmail.com', '8264771616', 'Hotel Shree Dhara	', 'Cold_Call', 'New', 'Hotel Shree Dhara	
8264771616	
Himanshubhai- Interested- details wp	
Station Rd, opp. Murali mandir, Ghanshyam Nagar, Dwarka, Gujarat 361335		https://maps.app.goo.gl/E5yAW7E8QBsqDQBZ6', 280, 46, NULL, '2026-03-07T10:48:31.978Z', '2026-03-07T10:48:31.978Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('34044465-3dff-4796-ad30-d1b6f4632212', 'Ashok ', 'test30@gmail.com', '7788875999', 'Sudarshan Palace By Spree', 'Cold_Call', 'New', 'Sudarshan Palace By Spree
9731525122-banglore office	
7788875999- Ashok interested
Railway, Station Rd, Ghanshyam Nagar, Dwarka, Gujarat 361335	
https://www.spreehotels.com/sudarshan-place-by-spree/', 280, 46, NULL, '2026-03-07T10:50:05.724Z', '2026-03-07T10:50:05.724Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('f4841590-5480-4548-8376-64885d36fc45', 'Ajitbhai Owner', 'test31@gmail.com', '9099955322', 'Hotel Narayan Inn	', 'Cold_Call', 'New', 'Hotel Narayan Inn	
9099955322	
Jhon reception- Ajitbhai owner- interested- detail WP	
opp. Home Guard Office Home Guard Chowk, Dwarka, Gujarat 361335		https://maps.app.goo.gl/KDCHnt6h55H7HAt27', 280, 46, NULL, '2026-03-07T10:51:19.220Z', '2026-03-07T10:51:19.220Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('e58e56d0-3b21-4ce2-bfc6-7d5df90f317b', 'Ashwin', 'test32@gmail.com', '9609696696', 'Hotel Shree Dwarka	', 'Cold_Call', 'New', 'Hotel Shree Dwarka	
9609696696	
Ashwin+Details wp	
Vegetable Market, nr. Dwarikadish tempal, Very, Dwarka, Gujarat 361335		https://maps.app.goo.gl/MHk8eHk1kdXBcYAS7', 280, 46, NULL, '2026-03-07T11:00:46.626Z', '2026-03-07T11:00:46.626Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('9187cc43-0466-4742-9a00-057740e408ff', 'Tejas', 'test33@gmail.com', '9726286398', 'Hotel Leela’s', 'Cold_Call', 'New', 'Hotel Leela’s	
9726286398
Tejas- Interested- Details WP	
Hotel Leela’s, Homeguard Chowk, Dwarka, Gujarat 361335
http://www.hotelleelas.com/	
Hotel Leela’s', 280, 46, NULL, '2026-03-07T11:02:00.518Z', '2026-03-07T11:02:00.518Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('ab92311a-aaa6-4fa5-b0e0-331e2d0dc3da', 'Savant gandhi', 'test34@gmail.com', '9825506060', 'Hotel Shree Vallabh	', 'Cold_Call', 'New', 'Hotel Shree Vallabh	
9825506060
Savant gandhi- two mutual friends in business 9825506060	
Dwarkadhish Temple Rd, Dwarka, Gujarat 361335		
https://maps.app.goo.gl/w74LAFbnaxrBBRMt8', 280, 46, NULL, '2026-03-07T11:03:09.349Z', '2026-03-07T11:03:09.349Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('113ed40a-72ad-46e9-a7a1-33582b58a63f', 'Kishor', 'test35@gmail.com', '9512075000', 'Hotel lord krishna	', 'Cold_Call', 'New', 'Hotel lord krishna	
9512075000	
Kishor- interested want details	
2nd Floor, Hotel Lord Krishna, MG Rd, above IDBI Bank, Dwarka, Gujarat 361335		https://maps.app.goo.gl/eW8FpPAeLVLBbqaz6', 280, 46, NULL, '2026-03-07T11:04:38.769Z', '2026-03-07T11:04:38.769Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('afe3aaa7-665d-4045-8d4d-5833de062eb5', 'Kirtibhai Dave', 'test36@gmail.com', '8200293394', 'Chitrakut Bungalows', 'Cold_Call', 'New', 'Chitrakut Bungalows - Homestay in Dwarka	
8200293394	
Kirtibhai Dave- 2 hotels and 2 stays( already working on new hotel) Want details demo and Price of product- 9427225810	
shidh vatika Society, Siddhnath Mahadev Rd, Dwarka, Gujarat 361335	
https://www.chitrakutbungalows.in/	
Chitrakut Bungalows - Homestay in Dwarka', 280, 46, NULL, '2026-03-07T11:05:43.940Z', '2026-03-07T11:05:43.940Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('133b89c7-f264-4a87-bc01-20ddc9422cb3', 'Shreefal', 'test37@gmail.com', '9879471719', 'Grand Palace', 'Cold_Call', 'New', 'Grand Palace	
9879471719	
Shreefal- Interested + Details and Demo WP	
Birla plot, Nageshwar Rd, near railway stations, Ghanshyam Nagar, Dwarka, Gujarat 361335	https://www.dwarkadekho.com/	
https://maps.app.goo.gl/Wos4VKqPm4RPDTZ38', 280, 46, NULL, '2026-03-07T11:06:49.131Z', '2026-03-07T11:06:49.131Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('a756a63c-bac1-49c7-86be-bf098e7acfcf', 'Tushar', 'test38@gmail.com', '9054782943', 'Hotel kaanha', 'Cold_Call', 'New', 'Hotel kaanha	
9054782943	
Tushar- Details WP	
BHARATIYA AHIR SAMAJ, near AKHIL, Dwarka, Gujarat 361335	https://exotichotelsolutions.com/rooms/hotel-kaanha-dwarka/	https://maps.app.goo.gl/KEUxpJ5LRymVddBC9', 280, 46, NULL, '2026-03-07T11:07:49.877Z', '2026-03-07T11:07:49.877Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('3586c275-cc58-45db-aad7-5338612f729a', 'user3', 'test39@gmail.com', '8980525525', 'Hotel Gomti', 'Cold_Call', 'New', 'Hotel Gomti	
8980525525	
Interested- details- WP	
Dhirubhai Ambani Marg, opp. Gomti River, Dwarka, Gujarat 361335	
http://www.hotelgomti.com/	
https://maps.app.goo.gl/cUSSM79DGjYGcJ8R7', 280, 46, NULL, '2026-03-07T11:09:54.919Z', '2026-03-07T11:09:54.919Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('c1adad2b-349e-4c1f-aefb-97d00d93dd09', 'user5', 'test40@gmail.com', '9904478429', 'Hotel City Pride	', 'Cold_Call', 'New', 'Hotel City Pride	
https://maps.app.goo.gl/RPuQ2EYiPZV1kdU57	
Bhavnagar	
9904478429	
Interested – want demo', 280, 46, NULL, '2026-03-07T11:11:26.738Z', '2026-03-07T11:11:26.738Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('a70c6bd7-9c43-4a04-964e-f54d0cc96367', 'Jaypal', 'test41@gmail.com', '9687888810', 'Hotel Meriton', 'Cold_Call', 'New', 'Hotel Meriton	
https://maps.app.goo.gl/ayG5dPAW9z6HCj4U6	
Bhavnagar	
9687888810	
Interested – demo (Owner Jaypal)', 280, 46, NULL, '2026-03-07T11:13:16.551Z', '2026-03-07T11:13:16.551Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('b5f87d1e-2959-46c2-8cc4-b714d10d89af', 'Trupti(Manager)', 'test42@gmail.com', '9904009904', 'Hotel The Sankalp Retreat', 'Cold_Call', 'New', 'Hotel The Sankalp Retreat	
https://maps.app.goo.gl/9qmN3aww9xBpbbqr9	
Bhavnagar	
9904009904	
Interested – demo (Trupti Manager)', 280, 46, NULL, '2026-03-07T11:14:26.304Z', '2026-03-07T11:14:26.304Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('38bf99d9-c339-4694-b787-f39e323478d0', 'user6', 'test43@gmail.com', '7575040303', 'HOTEL 4ReN', 'Cold_Call', 'New', 'HOTEL 4ReN	
https://maps.app.goo.gl/FzAtCM5gzB8K1dmC9	
Bhavnagar	
7575040303	
Interested – want demo (Managers)', 280, 46, NULL, '2026-03-07T11:15:29.305Z', '2026-03-07T11:15:29.305Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('54025528-426a-4cc6-847d-0a7b106b6f19', 'Mihir(Receptionist)', 'test44@gmail.com', '7777909074', 'Hotel The Pill', 'Cold_Call', 'New', 'Hotel The Pill	
https://maps.app.goo.gl/vHNo4FseCgP3T1DL6	
Bhavnagar	
7777909074	
Mihir – Reception	
Wp details', 280, 46, NULL, '2026-03-07T11:18:44.330Z', '2026-03-07T11:18:44.330Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('84d0bc67-a962-46c8-bb3f-8ca369478381', 'Janvi rathod ', 'test45@gmail.com', '7942687827', 'Hotel Sky Villa', 'Cold_Call', 'New', 'Hotel Sky Villa	
https://maps.app.goo.gl/rXSjgazXqrPpMVoRA	
Bhavnagar	
7942687827	
Interested – Janvi Rathod (Manager)', 280, 46, NULL, '2026-03-07T11:20:02.721Z', '2026-03-07T11:20:02.721Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('3aec438b-7449-4e79-a44e-70efb275bef2', 'Surpalsinh', 'test46@gmail.com', '6352662733', 'Hotel SD-9', 'Cold_Call', 'New', 'Hotel SD-9	
https://maps.app.goo.gl/Q6PqH6JfoJajcQev6	
Bhavnagar	
6352662733	
Manager busy – Surpalsinh(8154940937) 
want demo Interested+ Demo', 280, 46, NULL, '2026-03-07T11:21:10.382Z', '2026-03-07T11:21:10.382Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('c7fbfccf-7680-4c22-b909-ce7c051dcdb4', 'Padma Tiwari', 'test47@gmail.com', '8866096587', 'Hotel The Basil Park', 'Cold_Call', 'New', 'Hotel The Basil Park	
https://maps.app.goo.gl/oNZ72BwBH2ZiW4Lq6	
Bhavnagar	
8866096587	
Interested – Padma Tiwari male', 280, 46, NULL, '2026-03-07T11:22:49.642Z', '2026-03-07T11:22:49.642Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('844c6ebf-6389-4b0c-b885-78b3b4fd7ac6', 'Umangbhai', 'test48@gmail.com', '8485940556', 'Hotel Aura', 'Cold_Call', 'New', 'Hotel Aura
https://maps.app.goo.gl/vAUWnTqrYcAgd83dA	
Bhavnagar	
9904510109	
Umangbhai (8485940556)	
Interested+ want demo', 280, 46, NULL, '2026-03-07T11:25:19.715Z', '2026-03-07T11:25:19.715Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('1866dde1-b511-4fb0-aa71-9a003ea4c69e', 'user6', 'test49@gmail.com', '02782510456', 'Hotel Relax Inn', 'Cold_Call', 'New', 'Hotel Relax Inn
https://maps.app.goo.gl/7NE8PaKeMALrqVfd7
Q4FW+PJX, Opp. Jilla Panchyat, Darbar Street,, near Shree Ramji & Mahadev Mandir, Bhavnagar, Gujarat 364001
http://www.hotel-relaxinn.com/
02782510456
Owner not available, interested', 280, 46, NULL, '2026-03-07T11:27:00.548Z', '2026-03-07T11:27:00.548Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('7a2e4698-2bd1-426c-90f2-99783ec43250', 'user7', 'test50@gmail.com', '07016000087', 'Hotel Hare Krishna', 'Cold_Call', 'New', 'Hotel Hare Krishna
https://maps.app.goo.gl/uWx5xim7LdQsmVGR8
3rd floor, Shivalik trident shakti dham Above SBI bank, near cricket groun, railway station road Near jain derasar , Bhavnagar, Gujarat 364240
07016000087
interested+ want demo', 280, 46, NULL, '2026-03-07T11:40:12.276Z', '2026-03-07T11:40:12.276Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('cf68f900-7fd2-4c80-b084-ce1a4c2fe62d', 'user8', 'test51@gmail.com', '9898427969', 'Cheese & Chips', 'Cold_Call', 'New', 'Cheese & Chips
https://maps.app.goo.gl/Mj519N9Mpz2CaRcB7
9898427969-DEMO', 280, 46, NULL, '2026-03-07T11:41:16.238Z', '2026-03-07T11:41:16.238Z', NULL);
INSERT INTO leads (id, name, email, phone, company, source, status, notes, ownerId, departmentId, lastActivityAt, createdAt, updatedAt, lostReason) VALUES ('5b7fe089-c1d5-408a-aa21-36e52b321e4c', 'Ajaysinh', 'test52@gmail.com', '+918401074592', 'Zorko Brand Of Food Lovers', 'Cold_Call', 'New', 'Zorko Brand Of Food Lovers
Ajaysinh +918401074592
Interested+Demo
Zomato', 280, 46, NULL, '2026-03-07T11:42:09.909Z', '2026-03-07T11:42:09.909Z', NULL);

-- Data for table tasks
INSERT INTO tasks (id, title, description, assigneeId, creatorId, dueDate, priority, status, relatedToLeadId, projectId, productId, completedAt, createdAt, updatedAt, completionNote) VALUES ('7fe242c9-1768-427a-b471-e98ddc9b5f46', 'Client work update', 'Hotel Aaradhana, Bharosa fast food, Backbencher''s cafe, little heaven
4 Clients of Rashmi & Dashraj 
no updates from tech department 
Digital menu and software not given yet', 280, 280, '2026-03-15T00:00:00.000Z', 'High', 'Pending', NULL, NULL, 44, NULL, '2026-03-07T06:00:02.235Z', '2026-03-07T06:00:02.235Z', NULL);

-- Data for table products
INSERT INTO products (id, name, description, price, category, isActive, createdAt, updatedAt, productManagerId, status) VALUES (43, 'Ai document systems', '', 0, '', true, '2026-03-06T13:35:56.441Z', '2026-03-06T13:35:56.441Z', 283, 'Active');
INSERT INTO products (id, name, description, price, category, isActive, createdAt, updatedAt, productManagerId, status) VALUES (44, 'AI Menu System ', '<p><strong>AI&nbsp;Menu&nbsp;System</strong>&nbsp;is&nbsp;a&nbsp;smart&nbsp;digital&nbsp;menu&nbsp;platform&nbsp;for&nbsp;restaurants&nbsp;that&nbsp;replaces&nbsp;traditional&nbsp;menus&nbsp;with&nbsp;an&nbsp;interactive&nbsp;<strong>QR-based&nbsp;menu&nbsp;powered&nbsp;by&nbsp;AI</strong>.&nbsp;Customers&nbsp;scan&nbsp;a&nbsp;QR&nbsp;code&nbsp;to&nbsp;view&nbsp;the&nbsp;menu&nbsp;on&nbsp;their&nbsp;phone,&nbsp;explore&nbsp;dishes&nbsp;with&nbsp;images,&nbsp;get&nbsp;AI-powered&nbsp;recommendations,&nbsp;and&nbsp;even&nbsp;interact&nbsp;with&nbsp;a&nbsp;voice&nbsp;or&nbsp;chat&nbsp;assistant&nbsp;to&nbsp;ask&nbsp;about&nbsp;ingredients,&nbsp;combos,&nbsp;or&nbsp;popular&nbsp;items.</p>', 0, 'AI System ', true, '2026-03-06T21:30:05.528Z', '2026-03-06T21:32:09.677Z', 289, 'Active');

-- Data for table lead_notes
INSERT INTO lead_notes (id, leadId, authorId, content, isPrivate, createdAt, updatedAt) VALUES (102, 'cda27d9a-a412-43e9-b17a-dda50d3a4e02', 279, 'fgghjjxzfgfgfkmjhyzdsfgtghjc,hjhydertfbh', false, '2026-03-06T17:41:16.337Z', '2026-03-06T17:41:16.337Z');

-- Data for table eod_reports
INSERT INTO eod_reports (id, employeeId, date, content, leadsCount, tasksCount, createdAt, updatedAt) VALUES (389, 280, '2026-03-07T05:54:17.822Z', 'Certificate: internship completion
AI tool description (Internship +Training)', 0, 3, '2026-03-07T05:54:17.826Z', '2026-03-07T05:54:17.826Z');
INSERT INTO eod_reports (id, employeeId, date, content, leadsCount, tasksCount, createdAt, updatedAt) VALUES (390, 280, '2026-03-07T13:28:26.972Z', 'Post Design for internship
ibhavnagar payment-1300 with advertisement 
Leads upload in CRM
Hotel management software', 0, 4, '2026-03-07T13:28:26.973Z', '2026-03-07T13:28:26.973Z');

-- Data for table attendance
INSERT INTO attendance (id, employeeId, date, checkIn, checkOut, status, location, notes, createdAt, updatedAt) VALUES (1827, 282, '2026-03-06T00:00:00.000Z', '2026-03-06T11:18:50.993Z', NULL, 'Present', NULL, NULL, '2026-03-06T11:18:50.993Z', '2026-03-06T11:18:50.993Z');
INSERT INTO attendance (id, employeeId, date, checkIn, checkOut, status, location, notes, createdAt, updatedAt) VALUES (1828, 280, '2026-03-07T00:00:00.000Z', '2026-03-07T05:38:56.999Z', '2026-03-07T12:32:37.684Z', 'Present', NULL, NULL, '2026-03-07T05:38:56.999Z', '2026-03-07T12:32:37.686Z');
INSERT INTO attendance (id, employeeId, date, checkIn, checkOut, status, location, notes, createdAt, updatedAt) VALUES (1829, 281, '2026-03-07T00:00:00.000Z', '2026-03-07T06:20:16.409Z', '2026-03-07T13:16:10.441Z', 'Present', NULL, NULL, '2026-03-07T06:20:16.409Z', '2026-03-07T13:16:10.442Z');
INSERT INTO attendance (id, employeeId, date, checkIn, checkOut, status, location, notes, createdAt, updatedAt) VALUES (1830, 280, '2026-03-09T00:00:00.000Z', '2026-03-09T04:28:49.906Z', NULL, 'Present', NULL, NULL, '2026-03-09T04:28:49.906Z', '2026-03-09T04:28:49.906Z');
INSERT INTO attendance (id, employeeId, date, checkIn, checkOut, status, location, notes, createdAt, updatedAt) VALUES (1831, 291, '2026-03-09T00:00:00.000Z', '2026-03-09T04:38:36.268Z', NULL, 'Present', NULL, NULL, '2026-03-09T04:38:36.268Z', '2026-03-09T04:38:36.268Z');
INSERT INTO attendance (id, employeeId, date, checkIn, checkOut, status, location, notes, createdAt, updatedAt) VALUES (1832, 281, '2026-03-09T00:00:00.000Z', '2026-03-09T04:52:55.955Z', NULL, 'Present', NULL, NULL, '2026-03-09T04:52:55.955Z', '2026-03-09T04:52:55.955Z');
INSERT INTO attendance (id, employeeId, date, checkIn, checkOut, status, location, notes, createdAt, updatedAt) VALUES (1833, 287, '2026-03-09T00:00:00.000Z', '2026-03-09T07:02:49.440Z', NULL, 'Present', NULL, NULL, '2026-03-09T07:02:49.440Z', '2026-03-09T07:02:49.440Z');
INSERT INTO attendance (id, employeeId, date, checkIn, checkOut, status, location, notes, createdAt, updatedAt) VALUES (1834, 286, '2026-03-09T00:00:00.000Z', '2026-03-09T07:02:55.769Z', '2026-03-09T07:03:00.331Z', 'Present', NULL, NULL, '2026-03-09T07:02:55.769Z', '2026-03-09T07:03:00.332Z');
INSERT INTO attendance (id, employeeId, date, checkIn, checkOut, status, location, notes, createdAt, updatedAt) VALUES (1835, 288, '2026-03-09T00:00:00.000Z', '2026-03-09T07:05:35.020Z', NULL, 'Present', NULL, NULL, '2026-03-09T07:05:35.020Z', '2026-03-09T07:05:35.020Z');
INSERT INTO attendance (id, employeeId, date, checkIn, checkOut, status, location, notes, createdAt, updatedAt) VALUES (1836, 297, '2026-03-09T00:00:00.000Z', '2026-03-09T07:17:12.170Z', NULL, 'Present', NULL, NULL, '2026-03-09T07:17:12.170Z', '2026-03-09T07:17:12.170Z');
INSERT INTO attendance (id, employeeId, date, checkIn, checkOut, status, location, notes, createdAt, updatedAt) VALUES (1837, 293, '2026-03-09T00:00:00.000Z', '2026-03-09T07:17:41.361Z', NULL, 'Present', NULL, NULL, '2026-03-09T07:17:41.361Z', '2026-03-09T07:17:41.361Z');
INSERT INTO attendance (id, employeeId, date, checkIn, checkOut, status, location, notes, createdAt, updatedAt) VALUES (1838, 285, '2026-03-09T00:00:00.000Z', '2026-03-09T09:09:45.740Z', NULL, 'Present', NULL, NULL, '2026-03-09T09:09:45.740Z', '2026-03-09T09:09:45.740Z');
INSERT INTO attendance (id, employeeId, date, checkIn, checkOut, status, location, notes, createdAt, updatedAt) VALUES (1839, 283, '2026-03-09T00:00:00.000Z', '2026-03-09T09:42:12.527Z', NULL, 'Present', NULL, NULL, '2026-03-09T09:42:12.527Z', '2026-03-09T09:42:12.527Z');

-- Data for table leave_requests
INSERT INTO leave_requests (id, employeeId, startDate, endDate, type, reason, status, approvedById, managerNote, createdAt, updatedAt) VALUES (9, 286, '2026-03-09T00:00:00.000Z', '2026-03-09T00:00:00.000Z', 'Sick', 'testing', 'Pending', NULL, NULL, '2026-03-09T10:31:10.720Z', '2026-03-09T10:31:10.720Z');

-- Data for table activity_logs
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (131, 279, 'admin', 'CREATE_DEPARTMENT', '42', 'Sales Department ', 'New department created: Sales Department ', NULL, '2026-03-06T10:11:51.785Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (132, 279, 'admin', 'CREATE_DEPARTMENT', '43', 'Product Department', 'New department created: Product Department', NULL, '2026-03-06T10:12:11.035Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (133, 279, 'admin', 'ONBOARD_EMPLOYEE', '280', 'Rashmi  Parmar', 'New employee onboarded: Rashmi  Parmar (EMP002)', NULL, '2026-03-06T10:18:43.991Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (134, 279, 'admin', 'ONBOARD_EMPLOYEE', '281', 'Kiran  Choudhary', 'New employee onboarded: Kiran  Choudhary (EMP003)', NULL, '2026-03-06T10:22:04.961Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (135, 279, 'admin', 'BATCH_SYNC_PERMISSIONS', 'SYSTEM', 'Permission Matrix', 'Bulk permission update performed for 7 roles', NULL, '2026-03-06T10:23:47.638Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (136, 279, 'admin', 'ONBOARD_EMPLOYEE', '282', 'Akshat  Parmar', 'New employee onboarded: Akshat  Parmar (EMP004)', NULL, '2026-03-06T10:26:31.471Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (137, 279, 'admin', 'UPDATE_EMPLOYEE', '280', 'Rashmi  Parmar', 'Employee profile updated for Rashmi  Parmar', NULL, '2026-03-06T10:27:18.271Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (138, 279, 'admin', 'UPDATE_EMPLOYEE', '280', 'Rashmi  Parmar', 'Employee profile updated for Rashmi  Parmar', NULL, '2026-03-06T10:27:18.967Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (139, 279, 'admin', 'UPDATE_EMPLOYEE', '280', 'Rashmi  Parmar', 'Employee profile updated for Rashmi  Parmar', NULL, '2026-03-06T10:27:19.223Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (140, 279, 'admin', 'UPDATE_EMPLOYEE', '280', 'Rashmi  Parmar', 'Employee profile updated for Rashmi  Parmar', NULL, '2026-03-06T10:27:19.557Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (141, 279, 'admin', 'UPDATE_EMPLOYEE', '280', 'Rashmi  Parmar', 'Employee profile updated for Rashmi  Parmar', NULL, '2026-03-06T10:27:19.788Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (142, 279, 'admin', 'UPDATE_EMPLOYEE', '280', 'Rashmi  Parmar', 'Employee profile updated for Rashmi  Parmar', NULL, '2026-03-06T10:27:20.022Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (143, 279, 'admin', 'UPDATE_EMPLOYEE', '282', 'Akshat  Parmar', 'Employee profile updated for Akshat  Parmar', NULL, '2026-03-06T10:33:48.899Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (144, 279, 'admin', 'UPDATE_EMPLOYEE', '282', 'Akshat  Parmar', 'Employee profile updated for Akshat  Parmar', NULL, '2026-03-06T10:33:49.959Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (145, 279, 'admin', 'BATCH_SYNC_PERMISSIONS', 'SYSTEM', 'Permission Matrix', 'Bulk permission update performed for 7 roles', NULL, '2026-03-06T10:36:39.078Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (146, 282, 'products', 'CREATE', '42', 'Ai menu system ', 'New product added to catalog: Ai menu system ', NULL, '2026-03-06T11:12:12.132Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (147, 282, 'products', 'DELETE', '42', 'Ai menu system ', 'Product removed from catalog: Ai menu system ', NULL, '2026-03-06T11:12:21.708Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (148, 280, 'leads', 'CREATE', 'cda27d9a-a412-43e9-b17a-dda50d3a4e02', 'fulchand parmar', 'New lead created: fulchand parmar', NULL, '2026-03-06T11:17:56.246Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (149, 280, 'leads', 'CREATE', '301a9dd9-dfec-4d80-acf1-145b29f63b9d', 'abc', 'New lead created: abc', NULL, '2026-03-06T11:20:20.007Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (150, 280, 'leads', 'CREATE', '5655d044-025e-4258-bdbe-da9ee828ca38', 'Farukbhai', 'New lead created: Farukbhai', NULL, '2026-03-06T11:21:57.965Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (151, 280, 'leads', 'CREATE', '7f998dcb-51f1-429b-858c-dbe3c21946b4', 'Hirenbhai', 'New lead created: Hirenbhai', NULL, '2026-03-06T11:22:52.273Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (152, 280, 'leads', 'CREATE', '0c7753ff-595a-4b80-b6cd-09bfed95156e', 'Mayank', 'New lead created: Mayank', NULL, '2026-03-06T11:24:06.265Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (153, 280, 'leads', 'CREATE', '26fd08f5-559c-4868-9c93-819bc6060184', 'abcd', 'New lead created: abcd', NULL, '2026-03-06T11:24:58.416Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (154, 280, 'leads', 'CREATE', '3ae5f0e7-37c7-49a9-9afd-6997396d1472', 'Sundarraj', 'New lead created: Sundarraj', NULL, '2026-03-06T11:25:58.553Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (155, 280, 'leads', 'CREATE', '56720030-0cd6-4787-bbf9-9e41a36b8583', 'Mansurali Khan', 'New lead created: Mansurali Khan', NULL, '2026-03-06T11:27:30.240Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (156, 280, 'leads', 'CREATE', '4cbd0069-a31e-4fb9-8615-6e744fc5921b', 'abec', 'New lead created: abec', NULL, '2026-03-06T11:29:02.886Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (157, 280, 'leads', 'CREATE', 'ab28ae72-77e0-4885-a3b9-b4351429dfad', 'abcde', 'New lead created: abcde', NULL, '2026-03-06T11:32:40.840Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (158, 280, 'leads', 'CREATE', 'ecd48d9f-30d4-49f6-b1ab-517c3df489a7', 'Dilip', 'New lead created: Dilip', NULL, '2026-03-06T11:41:25.554Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (159, 280, 'leads', 'CREATE', '10238c7f-704b-48b5-b112-7d83623b856d', 'Santosh', 'New lead created: Santosh', NULL, '2026-03-06T11:42:34.703Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (160, 280, 'leads', 'CREATE', '42f62bf2-3fb3-4b83-84fd-12d9a6bd4f97', 'Rakesh', 'New lead created: Rakesh', NULL, '2026-03-06T11:44:05.555Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (161, 280, 'leads', 'CREATE', '23d93d2e-3616-400d-9166-de2682a8adb2', 'urvashi', 'New lead created: urvashi', NULL, '2026-03-06T11:45:32.606Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (162, 280, 'leads', 'CREATE', 'b4ab6b3a-0895-4036-ab82-24bffc26e214', 'Sanjay', 'New lead created: Sanjay', NULL, '2026-03-06T12:19:50.070Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (163, 280, 'leads', 'CREATE', '3661581e-7a75-4aa0-a49f-c08933eb4789', 'Mandeep', 'New lead created: Mandeep', NULL, '2026-03-06T12:22:26.874Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (164, 280, 'leads', 'CREATE', 'cedf9e1d-9632-4e9c-832c-0b19a7befd0a', 'Harsh', 'New lead created: Harsh', NULL, '2026-03-06T12:23:40.485Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (165, 280, 'leads', 'CREATE', 'a287f8f8-6363-4816-8dfa-49ac40077afc', 'Asfa', 'New lead created: Asfa', NULL, '2026-03-06T12:29:14.112Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (166, 280, 'leads', 'CREATE', '1e0536c4-b3cd-4013-b976-f7f36488571e', 'Madanji', 'New lead created: Madanji', NULL, '2026-03-06T12:34:58.235Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (167, 280, 'leads', 'CREATE', 'e14e6557-1606-45e5-b4dd-f27d06d4624c', 'abcdef', 'New lead created: abcdef', NULL, '2026-03-06T12:36:50.657Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (168, 279, 'admin', 'CREATE_DEPARTMENT', '44', 'Creative Department ', 'New department created: Creative Department ', NULL, '2026-03-06T12:37:26.083Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (169, 279, 'admin', 'UPDATE_DEPARTMENT', '44', 'Creative Department ', 'Department updated: Creative Department ', NULL, '2026-03-06T12:37:35.864Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (170, 280, 'leads', 'CREATE', '9e3e8607-dd50-45c9-b57b-b04d38f56eca', 'xyz', 'New lead created: xyz', NULL, '2026-03-06T12:38:25.476Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (171, 279, 'admin', 'CREATE_DEPARTMENT', '46', 'Operations Department ', 'New department created: Operations Department ', NULL, '2026-03-06T12:42:11.803Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (172, 279, 'admin', 'UPDATE_EMPLOYEE', '280', 'Rashmi  Parmar', 'Employee profile updated for Rashmi  Parmar', NULL, '2026-03-06T12:43:24.165Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (173, 279, 'admin', 'ONBOARD_EMPLOYEE', '283', 'Krishi  Shah', 'New employee onboarded: Krishi  Shah (EMP005)', NULL, '2026-03-06T12:44:58.736Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (174, 279, 'admin', 'BATCH_SYNC_PERMISSIONS', 'SYSTEM', 'Permission Matrix', 'Bulk permission update performed for 8 roles', NULL, '2026-03-06T12:49:55.596Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (175, 279, 'admin', 'UPDATE_EMPLOYEE', '283', 'Krishi  Shah', 'Employee profile updated for Krishi  Shah', NULL, '2026-03-06T12:51:40.324Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (176, 279, 'admin', 'BATCH_SYNC_PERMISSIONS', 'SYSTEM', 'Permission Matrix', 'Bulk permission update performed for 9 roles', NULL, '2026-03-06T12:52:05.702Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (177, 282, 'products', 'CREATE', '43', 'Ai document systems', 'New product added to catalog: Ai document systems', NULL, '2026-03-06T13:35:57.376Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (178, 279, 'leads', 'NOTE_ADDED', 'cda27d9a-a412-43e9-b17a-dda50d3a4e02', 'fulchand parmar', 'New note added to lead: fgghjjxzfgfgfkmjhyzdsfgtghjc,h...', NULL, '2026-03-06T17:41:16.987Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (179, 279, 'admin', 'ONBOARD_EMPLOYEE', '284', 'Alshifa Godil  ', 'New employee onboarded: Alshifa Godil   (EMP006)', NULL, '2026-03-06T19:21:31.655Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (180, 279, 'admin', 'BATCH_SYNC_PERMISSIONS', 'SYSTEM', 'Permission Matrix', 'Bulk permission update performed for 10 roles', NULL, '2026-03-06T19:26:06.141Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (181, 279, 'admin', 'SYNC_PERMISSIONS', '145', 'Operations Manager ', 'Permissions synced for role: Operations Manager ', NULL, '2026-03-06T19:27:30.905Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (182, 279, 'admin', 'BATCH_SYNC_PERMISSIONS', 'SYSTEM', 'Permission Matrix', 'Bulk permission update performed for 10 roles', NULL, '2026-03-06T19:27:36.058Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (183, 279, 'admin', 'UPDATE_DEPARTMENT', '44', 'Creative Department ', 'Department updated: Creative Department ', NULL, '2026-03-06T19:30:04.316Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (184, 279, 'admin', 'ONBOARD_EMPLOYEE', '285', 'Danish  Parmar ', 'New employee onboarded: Danish  Parmar  (EMP007)', NULL, '2026-03-06T20:39:10.500Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (185, 279, 'admin', 'ONBOARD_EMPLOYEE', '286', 'Alfaz Bilakhiya', 'New employee onboarded: Alfaz Bilakhiya (EMP008)', NULL, '2026-03-06T20:45:28.871Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (186, 279, 'admin', 'ONBOARD_EMPLOYEE', '287', 'Dhanashree  Trambadiya', 'New employee onboarded: Dhanashree  Trambadiya (EMP009)', NULL, '2026-03-06T20:56:25.397Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (187, 279, 'admin', 'ONBOARD_EMPLOYEE', '288', 'Darshraj A', 'New employee onboarded: Darshraj A (EMP010)', NULL, '2026-03-06T21:00:45.552Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (188, 279, 'admin', 'BATCH_SYNC_PERMISSIONS', 'SYSTEM', 'Permission Matrix', 'Bulk permission update performed for 13 roles', NULL, '2026-03-06T21:07:03.671Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (189, 279, 'admin', 'BATCH_SYNC_PERMISSIONS', 'SYSTEM', 'Permission Matrix', 'Bulk permission update performed for 13 roles', NULL, '2026-03-06T21:07:22.596Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (190, 279, 'admin', 'BATCH_SYNC_PERMISSIONS', 'SYSTEM', 'Permission Matrix', 'Bulk permission update performed for 13 roles', NULL, '2026-03-06T21:21:58.814Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (191, 279, 'admin', 'BATCH_SYNC_PERMISSIONS', 'SYSTEM', 'Permission Matrix', 'Bulk permission update performed for 13 roles', NULL, '2026-03-06T21:23:29.324Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (192, 279, 'admin', 'BATCH_SYNC_PERMISSIONS', 'SYSTEM', 'Permission Matrix', 'Bulk permission update performed for 14 roles', NULL, '2026-03-06T21:26:38.996Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (193, 279, 'products', 'CREATE', '44', 'AI Menu System ', 'New product added to catalog: AI Menu System ', NULL, '2026-03-06T21:30:06.258Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (194, 279, 'admin', 'ONBOARD_EMPLOYEE', '289', 'Bhargav Gohel ', 'New employee onboarded: Bhargav Gohel  (EMP011)', NULL, '2026-03-06T21:31:32.946Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (195, 279, 'admin', 'UPDATE_EMPLOYEE', '289', 'Bhargav Gohel ', 'Employee profile updated for Bhargav Gohel ', NULL, '2026-03-06T21:31:52.601Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (196, 279, 'admin', 'UPDATE_EMPLOYEE', '289', 'Bhargav Gohel ', 'Employee profile updated for Bhargav Gohel ', NULL, '2026-03-06T21:31:52.833Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (197, 279, 'products', 'UPDATE', '44', 'AI Menu System ', 'Product information updated for AI Menu System ', NULL, '2026-03-06T21:32:10.385Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (198, 280, 'products', 'TASK_CREATE', '44', 'Client work update', 'Task created: Client work update', NULL, '2026-03-07T06:00:02.793Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (199, 280, 'leads', 'CREATE', '2f6b3684-f867-4a7f-8685-fd9cce6d2865', 'Yunusbhai', 'New lead created: Yunusbhai', NULL, '2026-03-07T06:03:23.306Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (200, 280, 'leads', 'CREATE', '02449459-324a-441a-8445-70661e61409b', 'user', 'New lead created: user', NULL, '2026-03-07T06:20:35.603Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (201, 281, 'leads', 'CREATE', '036983a6-a489-4c44-aac7-3365f47c8422', 'Neel Patel', 'New lead created: Neel Patel', NULL, '2026-03-07T06:51:42.282Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (202, 279, 'admin', 'UPDATE_EMPLOYEE', '282', 'Akshat  Parmar', 'Employee profile updated for Akshat  Parmar', NULL, '2026-03-07T10:12:27.532Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (203, 280, 'leads', 'CREATE', '4bbc0d39-8912-48f4-ab02-4d8dd52fc0cb', 'user1', 'New lead created: user1', NULL, '2026-03-07T10:40:36.146Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (204, 280, 'leads', 'CREATE', '5ccda9a9-2f24-4989-a626-7b8e6921d3c3', 'PD gohil', 'New lead created: PD gohil', NULL, '2026-03-07T10:42:14.224Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (205, 280, 'leads', 'CREATE', '692b56f3-1293-41ba-951b-10229ae4ecdc', 'Ghanshyam thakkar', 'New lead created: Ghanshyam thakkar', NULL, '2026-03-07T10:43:17.307Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (206, 280, 'leads', 'CREATE', 'e7d8ee5f-fd1d-4912-87be-727184021b76', 'user2', 'New lead created: user2', NULL, '2026-03-07T10:45:05.007Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (207, 280, 'leads', 'CREATE', '212482c6-58bf-4f50-a9ab-9dbd3024d864', 'DR Rana', 'New lead created: DR Rana', NULL, '2026-03-07T10:46:15.519Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (208, 280, 'leads', 'CREATE', 'b3f97cb7-caa2-4069-8c17-c11e1d37fa09', 'Himanshubhai', 'New lead created: Himanshubhai', NULL, '2026-03-07T10:48:32.136Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (209, 280, 'leads', 'CREATE', '34044465-3dff-4796-ad30-d1b6f4632212', 'Ashok ', 'New lead created: Ashok ', NULL, '2026-03-07T10:50:05.804Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (210, 280, 'leads', 'CREATE', 'f4841590-5480-4548-8376-64885d36fc45', 'Ajitbhai Owner', 'New lead created: Ajitbhai Owner', NULL, '2026-03-07T10:51:19.299Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (211, 280, 'leads', 'CREATE', 'e58e56d0-3b21-4ce2-bfc6-7d5df90f317b', 'Ashwin', 'New lead created: Ashwin', NULL, '2026-03-07T11:00:46.928Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (212, 280, 'leads', 'CREATE', '9187cc43-0466-4742-9a00-057740e408ff', 'Tejas', 'New lead created: Tejas', NULL, '2026-03-07T11:02:00.599Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (213, 280, 'leads', 'CREATE', 'ab92311a-aaa6-4fa5-b0e0-331e2d0dc3da', 'Savant gandhi', 'New lead created: Savant gandhi', NULL, '2026-03-07T11:03:09.506Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (214, 280, 'leads', 'CREATE', '113ed40a-72ad-46e9-a7a1-33582b58a63f', 'Kishor', 'New lead created: Kishor', NULL, '2026-03-07T11:04:38.849Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (215, 280, 'leads', 'CREATE', 'afe3aaa7-665d-4045-8d4d-5833de062eb5', 'Kirtibhai Dave', 'New lead created: Kirtibhai Dave', NULL, '2026-03-07T11:05:44.020Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (216, 280, 'leads', 'CREATE', '133b89c7-f264-4a87-bc01-20ddc9422cb3', 'Shreefal', 'New lead created: Shreefal', NULL, '2026-03-07T11:06:49.211Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (217, 280, 'leads', 'CREATE', 'a756a63c-bac1-49c7-86be-bf098e7acfcf', 'Tushar', 'New lead created: Tushar', NULL, '2026-03-07T11:07:49.958Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (218, 280, 'leads', 'CREATE', '3586c275-cc58-45db-aad7-5338612f729a', 'user3', 'New lead created: user3', NULL, '2026-03-07T11:09:55.075Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (219, 280, 'leads', 'CREATE', 'c1adad2b-349e-4c1f-aefb-97d00d93dd09', 'user5', 'New lead created: user5', NULL, '2026-03-07T11:11:26.816Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (220, 280, 'leads', 'CREATE', 'a70c6bd7-9c43-4a04-964e-f54d0cc96367', 'Jaypal', 'New lead created: Jaypal', NULL, '2026-03-07T11:13:16.632Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (221, 280, 'leads', 'CREATE', 'b5f87d1e-2959-46c2-8cc4-b714d10d89af', 'Trupti(Manager)', 'New lead created: Trupti(Manager)', NULL, '2026-03-07T11:14:26.426Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (222, 280, 'leads', 'CREATE', '38bf99d9-c339-4694-b787-f39e323478d0', 'user6', 'New lead created: user6', NULL, '2026-03-07T11:15:29.462Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (223, 280, 'leads', 'CREATE', '54025528-426a-4cc6-847d-0a7b106b6f19', 'Mihir(Receptionist)', 'New lead created: Mihir(Receptionist)', NULL, '2026-03-07T11:18:44.410Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (224, 280, 'leads', 'CREATE', '84d0bc67-a962-46c8-bb3f-8ca369478381', 'Janvi rathod ', 'New lead created: Janvi rathod ', NULL, '2026-03-07T11:20:02.803Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (225, 280, 'leads', 'CREATE', '3aec438b-7449-4e79-a44e-70efb275bef2', 'Surpalsinh', 'New lead created: Surpalsinh', NULL, '2026-03-07T11:21:10.540Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (226, 280, 'leads', 'CREATE', 'c7fbfccf-7680-4c22-b909-ce7c051dcdb4', 'Padma Tiwari', 'New lead created: Padma Tiwari', NULL, '2026-03-07T11:22:49.723Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (227, 280, 'leads', 'CREATE', '844c6ebf-6389-4b0c-b885-78b3b4fd7ac6', 'Umangbhai', 'New lead created: Umangbhai', NULL, '2026-03-07T11:25:19.795Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (228, 280, 'leads', 'CREATE', '1866dde1-b511-4fb0-aa71-9a003ea4c69e', 'user6', 'New lead created: user6', NULL, '2026-03-07T11:27:00.706Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (229, 280, 'leads', 'CREATE', '7a2e4698-2bd1-426c-90f2-99783ec43250', 'user7', 'New lead created: user7', NULL, '2026-03-07T11:40:12.446Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (230, 280, 'leads', 'CREATE', 'cf68f900-7fd2-4c80-b084-ce1a4c2fe62d', 'user8', 'New lead created: user8', NULL, '2026-03-07T11:41:16.317Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (231, 280, 'leads', 'CREATE', '5b7fe089-c1d5-408a-aa21-36e52b321e4c', 'Ajaysinh', 'New lead created: Ajaysinh', NULL, '2026-03-07T11:42:09.990Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (232, 279, 'admin', 'BATCH_SYNC_PERMISSIONS', 'SYSTEM', 'Permission Matrix', 'Bulk permission update performed for 14 roles', NULL, '2026-03-08T11:42:42.071Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (233, 279, 'admin', 'ONBOARD_EMPLOYEE', '291', 'Shubham Raj ', 'New employee onboarded: Shubham Raj  (EMP012)', NULL, '2026-03-08T11:45:11.752Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (234, 279, 'admin', 'ONBOARD_EMPLOYEE', '292', 'Aneri Dadhaniya ', 'New employee onboarded: Aneri Dadhaniya  (EMP013)', NULL, '2026-03-08T11:48:32.328Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (235, 279, 'admin', 'ONBOARD_EMPLOYEE', '293', 'Manisha  Tejvani', 'New employee onboarded: Manisha  Tejvani (EMP014)', NULL, '2026-03-08T11:49:11.435Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (236, 279, 'admin', 'ONBOARD_EMPLOYEE', '294', 'Shreya  Uttam', 'New employee onboarded: Shreya  Uttam (EMP015)', NULL, '2026-03-08T11:49:41.271Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (237, 279, 'admin', 'ONBOARD_EMPLOYEE', '295', 'Dhanashri  Kadam', 'New employee onboarded: Dhanashri  Kadam (EMP016)', NULL, '2026-03-08T11:50:16.168Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (238, 279, 'admin', 'ONBOARD_EMPLOYEE', '296', 'Ravi  parmar', 'New employee onboarded: Ravi  parmar (EMP017)', NULL, '2026-03-08T11:51:38.089Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (239, 279, 'admin', 'ONBOARD_EMPLOYEE', '297', 'Hanshika M', 'New employee onboarded: Hanshika M (EMP018)', NULL, '2026-03-08T11:52:35.939Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (240, 279, 'admin', 'CREATE_DEPARTMENT', '47', 'Project', 'New department created: Project', NULL, '2026-03-08T11:53:38.761Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (241, 279, 'admin', 'UPDATE_DEPARTMENT', '47', 'Project Department', 'Department updated: Project Department', NULL, '2026-03-08T11:54:29.359Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (242, 279, 'admin', 'ONBOARD_EMPLOYEE', '298', 'Tanu  Jaiswal ', 'New employee onboarded: Tanu  Jaiswal  (EMP019)', NULL, '2026-03-08T11:57:45.139Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (243, 279, 'admin', 'BATCH_SYNC_PERMISSIONS', 'SYSTEM', 'Permission Matrix', 'Bulk permission update performed for 20 roles', NULL, '2026-03-08T12:06:38.382Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (244, 279, 'admin', 'BATCH_SYNC_PERMISSIONS', 'SYSTEM', 'Permission Matrix', 'Bulk permission update performed for 20 roles', NULL, '2026-03-08T12:08:43.465Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (245, 279, 'admin', 'BATCH_SYNC_PERMISSIONS', 'SYSTEM', 'Permission Matrix', 'Bulk permission update performed for 20 roles', NULL, '2026-03-08T12:10:17.576Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (246, 279, 'admin', 'UPDATE_EMPLOYEE', '282', 'Akshat  Parmar', 'Employee profile updated for Akshat  Parmar', NULL, '2026-03-08T12:14:43.043Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (247, 279, 'admin', 'UPDATE_EMPLOYEE', '282', 'Akshat  Parmar', 'Employee profile updated for Akshat  Parmar', NULL, '2026-03-08T12:15:47.912Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (248, 279, 'admin', 'UPDATE_EMPLOYEE', '297', 'Hanshika Singh', 'Employee profile updated for Hanshika Singh', NULL, '2026-03-09T08:44:54.929Z');
INSERT INTO activity_logs (id, employeeId, module, action, entityId, entityName, description, metadata, createdAt) VALUES (249, 279, 'admin', 'UPDATE_EMPLOYEE', '294', 'Shreya  Khedkar', 'Employee profile updated for Shreya  Khedkar', NULL, '2026-03-09T08:46:45.578Z');


SET session_replication_role = 'origin';
