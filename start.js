#!/usr/bin/env node
/**
 * Unified start script for CropCure
 * Runs both backend (Flask) and frontend (Vite) simultaneously
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if Python is available
function checkPython() {
  return new Promise((resolve) => {
    const python = process.platform === 'win32' ? 'python' : 'python3';
    const check = spawn(python, ['--version']);
    
    check.on('close', (code) => {
      resolve(code === 0);
    });
    
    check.on('error', () => {
      resolve(false);
    });
  });
}

// Check if backend dependencies are installed
async function checkBackendDeps() {
  const requirementsPath = path.join(__dirname, 'backend', 'requirements.txt');
  const checkScriptPath = path.join(__dirname, 'backend', 'check_dependencies.py');
  
  if (!fs.existsSync(requirementsPath)) {
    log('❌ requirements.txt not found in backend folder', 'red');
    return false;
  }
  
  // Run the Python dependency checker
  const python = process.platform === 'win32' ? 'python' : 'python3';
  return new Promise((resolve) => {
    if (!fs.existsSync(checkScriptPath)) {
      log('⚠️  Dependency checker not found. Installing dependencies directly...', 'yellow');
      const pip = spawn(python, ['-m', 'pip', 'install', '-r', 'requirements.txt'], {
        cwd: path.join(__dirname, 'backend'),
        stdio: 'inherit',
        shell: true
      });
      
      pip.on('close', (code) => {
        resolve(code === 0);
      });
      
      pip.on('error', () => {
        resolve(false);
      });
      return;
    }
    
    const check = spawn(python, [checkScriptPath], {
      cwd: path.join(__dirname, 'backend'),
      stdio: 'inherit',
      shell: true
    });
    
    check.on('close', (code) => {
      resolve(code === 0);
    });
    
    check.on('error', () => {
      log('⚠️  Could not run dependency checker. Installing dependencies directly...', 'yellow');
      const pip = spawn(python, ['-m', 'pip', 'install', '-r', 'requirements.txt'], {
        cwd: path.join(__dirname, 'backend'),
        stdio: 'inherit',
        shell: true
      });
      
      pip.on('close', (pipCode) => {
        resolve(pipCode === 0);
      });
      
      pip.on('error', () => {
        resolve(false);
      });
    });
  });
}

// Check if frontend dependencies are installed
function checkFrontendDeps() {
  const nodeModulesPath = path.join(__dirname, 'frontend', 'node_modules');
  return fs.existsSync(nodeModulesPath);
}

async function main() {
  log('\n🌱 CropCure - Starting Application...\n', 'green');
  
  // Check Python
  const hasPython = await checkPython();
  if (!hasPython) {
    log('❌ Python not found. Please install Python 3.8+', 'red');
    process.exit(1);
  }
  
  // Check backend dependencies
  if (!checkBackendDeps()) {
    log('❌ Backend setup incomplete', 'red');
    process.exit(1);
  }
  
  // Check frontend dependencies
  if (!checkFrontendDeps()) {
    log('⚠️  Frontend dependencies not installed. Installing...', 'yellow');
    const npmInstall = spawn('npm', ['install'], {
      cwd: path.join(__dirname, 'frontend'),
      stdio: 'inherit',
      shell: true
    });
    
    npmInstall.on('close', (code) => {
      if (code !== 0) {
        log('❌ Failed to install frontend dependencies', 'red');
        process.exit(1);
      }
      startServers();
    });
  } else {
    startServers();
  }
}

function startServers() {
  const python = process.platform === 'win32' ? 'python' : 'python3';
  const backendPath = path.join(__dirname, 'backend', 'app.py');
  
  log('🚀 Starting Backend Server (Flask)...', 'blue');
  const backend = spawn(python, [backendPath], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: true
  });
  
  // Wait a bit before starting frontend
  setTimeout(() => {
    log('🚀 Starting Frontend Server (Vite)...', 'blue');
    const frontend = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'frontend'),
      stdio: 'inherit',
      shell: true
    });
    
    frontend.on('close', () => {
      backend.kill();
      process.exit(0);
    });
  }, 2000);
  
  backend.on('close', () => {
    process.exit(0);
  });
  
  // Handle Ctrl+C
  process.on('SIGINT', () => {
    log('\n\n🛑 Shutting down servers...', 'yellow');
    backend.kill();
    process.exit(0);
  });
}

main();
