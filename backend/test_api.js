
async function testEndpoints() {
  const baseUrl = 'http://localhost:4000/api';
  const leadId = '7cb9bac7-ed37-47c1-a6443-9458ae8d333e';
  const endpoints = [
    '/health',
    '/leads',
    `/leads/${leadId}`,
    '/admin/employees/hierarchy'
  ];

  console.log("--- API Endpoint Test (Specific ID) ---");
  for (const endpoint of endpoints) {
    try {
      const startTime = Date.now();
      const response = await fetch(baseUrl + endpoint);
      const duration = Date.now() - startTime;
      
      console.log(`RESULT: ${endpoint} -> Status ${response.status} (${duration}ms)`);
      if (response.status === 404) {
        console.log(` !!! WARNING: 404 FOUND ON ${endpoint}`);
      }
    } catch (error) {
      console.log(`FAIL: ${endpoint} -> Error: ${error.message}`);
    }
  }
}

testEndpoints();
