import { spawn } from 'node:child_process';
import path from 'node:path';

const [modulePath, ...args] = process.argv.slice(2);

if (!modulePath) {
  console.error('Usage: node scripts/run-local-node-module.mjs <module-path> [...args]');
  process.exit(1);
}

const child = spawn(process.execPath, [path.resolve(modulePath), ...args], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    NODE_DISABLE_COMPILE_CACHE: '1'
  },
  stdio: 'inherit'
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

