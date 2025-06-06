const { spawn } = require('child_process');
const path = require('path');

function startNextJS() {
  const nextProcess = spawn('npx', ['next', 'dev', '-p', '3000', '--hostname', '0.0.0.0'], {
    cwd: path.join(__dirname, 'client-nextjs'),
    stdio: ['ignore', 'pipe', 'pipe']
  });

  nextProcess.stdout.on('data', (data) => {
    console.log(`[Next.js] ${data}`);
  });

  nextProcess.stderr.on('data', (data) => {
    console.log(`[Next.js] ${data}`);
  });

  return nextProcess;
}

function startServer() {
  const serverProcess = spawn('node', ['index.js'], {
    cwd: path.join(__dirname, 'server'),
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`[Server] ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.log(`[Server] ${data}`);
  });

  return serverProcess;
}

console.log('Starting LN Partners Groupware System...');
console.log('Client will be available at: http://localhost:3000');
console.log('Server will be available at: http://localhost:3001');

const nextProcess = startNextJS();
const serverProcess = startServer();

process.on('SIGINT', () => {
  nextProcess.kill();
  serverProcess.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  nextProcess.kill();
  serverProcess.kill();
  process.exit();
});