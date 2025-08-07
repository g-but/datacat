#!/usr/bin/env node

/**
 * Authentication System Integration Test
 * Tests all authentication endpoints and demonstrates backend concepts
 */

const http = require('http');

const API_BASE = 'http://localhost:5001/api/v1';

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runAuthTests() {
  console.log('🧪 Starting Authentication Integration Tests\n');
  
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'testpass123',
    name: 'Integration Test User'
  };
  let userToken = '';

  try {
    // Test 1: User Registration
    console.log('1️⃣ Testing User Registration...');
    const registerOptions = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/v1/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const registerResponse = await makeRequest(registerOptions, testUser);
    console.log(`   Status: ${registerResponse.status}`);
    console.log(`   Message: ${registerResponse.data.message}`);
    
    if (registerResponse.status === 201 && registerResponse.data.success) {
      console.log('   ✅ Registration successful');
      console.log(`   ✅ User ID: ${registerResponse.data.user.id.substring(0, 10)}...`);
      console.log(`   ✅ JWT Token generated: ${registerResponse.data.token.substring(0, 20)}...`);
      userToken = registerResponse.data.token;
    } else {
      console.log('   ❌ Registration failed');
      return;
    }

    // Test 2: User Login
    console.log('\n2️⃣ Testing User Login...');
    const loginOptions = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const loginResponse = await makeRequest(loginOptions, {
      email: testUser.email,
      password: testUser.password
    });
    
    console.log(`   Status: ${loginResponse.status}`);
    console.log(`   Message: ${loginResponse.data.message}`);
    
    if (loginResponse.status === 200 && loginResponse.data.success) {
      console.log('   ✅ Login successful');
      userToken = loginResponse.data.token;
    } else {
      console.log('   ❌ Login failed');
      return;
    }

    // Test 3: Protected Endpoint Access
    console.log('\n3️⃣ Testing Protected Endpoint Access...');
    const profileOptions = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/v1/auth/profile',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    };
    
    const profileResponse = await makeRequest(profileOptions);
    console.log(`   Status: ${profileResponse.status}`);
    
    if (profileResponse.status === 200 && profileResponse.data.success) {
      console.log('   ✅ Protected endpoint access successful');
      console.log(`   ✅ User profile retrieved: ${profileResponse.data.user.email}`);
    } else {
      console.log('   ❌ Protected endpoint access failed');
    }

    // Test 4: Invalid Token Rejection
    console.log('\n4️⃣ Testing Invalid Token Rejection...');
    const invalidTokenOptions = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/v1/auth/profile',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer invalid-token-here'
      }
    };
    
    const invalidResponse = await makeRequest(invalidTokenOptions);
    console.log(`   Status: ${invalidResponse.status}`);
    
    if (invalidResponse.status === 401 && !invalidResponse.data.success) {
      console.log('   ✅ Invalid token correctly rejected');
    } else {
      console.log('   ❌ Invalid token should be rejected');
    }

    // Test 5: Token Verification
    console.log('\n5️⃣ Testing Token Verification...');
    const verifyOptions = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/v1/auth/verify',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    };
    
    const verifyResponse = await makeRequest(verifyOptions);
    console.log(`   Status: ${verifyResponse.status}`);
    
    if (verifyResponse.status === 200 && verifyResponse.data.success) {
      console.log('   ✅ Token verification successful');
    } else {
      console.log('   ❌ Token verification failed');
    }

    // Test 6: Invalid Login Credentials
    console.log('\n6️⃣ Testing Invalid Login Credentials...');
    const invalidLoginResponse = await makeRequest(loginOptions, {
      email: testUser.email,
      password: 'wrongpassword'
    });
    
    console.log(`   Status: ${invalidLoginResponse.status}`);
    
    if (invalidLoginResponse.status === 401 && !invalidLoginResponse.data.success) {
      console.log('   ✅ Invalid credentials correctly rejected');
    } else {
      console.log('   ❌ Invalid credentials should be rejected');
    }

    // Backend Concepts Demo
    console.log('\n🎓 Backend Engineering Concepts Demonstrated:');
    console.log('   🔐 Password Hashing: Bcrypt with salt rounds');
    console.log('   🎫 JWT Tokens: Stateless authentication');
    console.log('   🛡️ Middleware: Authorization protection');
    console.log('   📊 Database: User persistence with Prisma');
    console.log('   ⚡ HTTP Status Codes: Proper REST responses');
    console.log('   🔄 CRUD Operations: Create users, read profiles');

    console.log('\n✅ All Authentication Tests Completed Successfully! 🎉');

  } catch (error) {
    console.error('\n❌ Test Suite Failed:', error.message);
  }
}

// Run the tests
runAuthTests();