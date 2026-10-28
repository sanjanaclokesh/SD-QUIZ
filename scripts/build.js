import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const clientDir = path.join(rootDir, 'client');
const clientDist = path.join(clientDir, 'dist');
const rootDist = path.join(rootDir, 'dist');

console.log('📦 Installing client dependencies...');
execSync('npm install', { cwd: clientDir, stdio: 'inherit' });

console.log('🚀 Building Vite frontend client...');
execSync('npm run build', { cwd: clientDir, stdio: 'inherit' });

console.log('📁 Copying client/dist to root dist/ for Vercel output directory...');
if (fs.existsSync(rootDist)) {
  fs.rmSync(rootDist, { recursive: true, force: true });
}
fs.cpSync(clientDist, rootDist, { recursive: true });

console.log('✅ Build completed successfully! Output directory verified at: ' + rootDist);
