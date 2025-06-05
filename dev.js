#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')

// Start Next.js development server
const nextProcess = spawn('npx', ['next', 'dev', '--port', '3000'], {
  cwd: path.join(__dirname, 'client-nextjs'),
  stdio: 'inherit'
})

nextProcess.on('error', (err) => {
  console.error('Failed to start Next.js server:', err)
})

nextProcess.on('close', (code) => {
  console.log(`Next.js server exited with code ${code}`)
})

process.on('SIGINT', () => {
  nextProcess.kill('SIGINT')
  process.exit()
})

process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM')
  process.exit()
})