#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Kill any existing processes on our ports
const { exec } = require('child_process');

function killExistingProcesses() {
  return new Promise((resolve) => {
    exec('lsof -ti:3000,5000 | xargs -r kill -9', (error) => {
      // Ignore errors, just continue
      setTimeout(resolve, 1000); // Wait a bit for cleanup
    });
  });
}

async function startApplication() {
  console.log('🚀 Starting LN Partners Groupware System...');
  
  // Clean up any existing processes
  await killExistingProcesses();
  
  // Start Next.js client
  console.log('📱 Starting Next.js client on port 3000...');
  const clientProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'client-nextjs'),
    stdio: ['ignore', 'pipe', 'pipe']
  });

  clientProcess.stdout.on('data', (data) => {
    console.log(`[Client] ${data.toString().trim()}`);
  });

  clientProcess.stderr.on('data', (data) => {
    console.log(`[Client] ${data.toString().trim()}`);
  });

  // Start backend server
  console.log('🔧 Starting backend server on port 5000...');
  const serverProcess = spawn('node', ['index.js'], {
    cwd: path.join(__dirname, 'server'),
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`[Server] ${data.toString().trim()}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.log(`[Server] ${data.toString().trim()}`);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    clientProcess.kill('SIGTERM');
    serverProcess.kill('SIGTERM');
    setTimeout(() => {
      clientProcess.kill('SIGKILL');
      serverProcess.kill('SIGKILL');
      process.exit(0);
    }, 5000);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down servers...');
    clientProcess.kill('SIGTERM');
    serverProcess.kill('SIGTERM');
    setTimeout(() => {
      clientProcess.kill('SIGKILL');
      serverProcess.kill('SIGKILL');
      process.exit(0);
    }, 5000);
  });

  console.log('✅ Application started successfully!');
  console.log('🌐 Client: http://localhost:3000');
  console.log('⚡ Server: http://localhost:5000');
  console.log('📊 GraphQL Playground: http://localhost:5000/graphql');
  console.log('\nPress Ctrl+C to stop the servers');
}

startApplication().catch(console.error);