// Script para configurar el entorno de desarrollo local
import dotenv from 'dotenv';
import { spawn } from 'child_process';

dotenv.config({ path: '.env.local' });

console.log('🔧 Configurando entorno de desarrollo local...');
console.log('✅ Variables de entorno configuradas:');
console.log(`   DATABASE_HOST: ${process.env.DATABASE_HOST}`);
console.log(`   DATABASE_PORT: ${process.env.DATABASE_PORT}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);

// Ejecutar NestJS
const nest = spawn('npx', ['nest', 'start', '--watch'], {
  stdio: 'inherit',
  env: process.env,
  shell: true
});

nest.on('close', (_code) => {
  console.log('\n🔴 Backend cerrado');
});