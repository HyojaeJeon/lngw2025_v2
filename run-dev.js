#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')

console.log('Starting LN Partners Employee Management System...')

// Start Next.js client on port 3001
const clientProcess = spawn('npm', ['run', 'dev', '--', '--port', '3001'], {
  cwd: path.join(__dirname, 'client-nextjs'),
  stdio: 'inherit',
  shell: true
})

// Start GraphQL server on port 3000
const serverProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
})

// Handle process cleanup
process.on('SIGINT', () => {
  console.log('\nShutting down servers...')
  clientProcess.kill('SIGINT')
  serverProcess.kill('SIGINT')
  process.exit()
})

process.on('SIGTERM', () => {
  clientProcess.kill('SIGTERM')
  serverProcess.kill('SIGTERM')
  process.exit()
})

clientProcess.on('error', (err) => {
  console.error('Client process error:', err)
})

serverProcess.on('error', (err) => {
  console.error('Server process error:', err)
})

console.log('✓ Client starting on http://localhost:3001')
console.log('✓ Server starting on http://localhost:3000')
console.log('✓ Employee Management System ready')