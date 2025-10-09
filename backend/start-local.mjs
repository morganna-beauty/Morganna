import dotenv from 'dotenv';
import { spawn } from 'child_process';

const logger = {
  log: (message) => {
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] [LOCAL-DEV] ${message}`);
  },
  error: (message) => {
    const timestamp = new Date().toISOString();

    console.error(`[${timestamp}] [LOCAL-DEV] ERROR: ${message}`);
  }
};

dotenv.config({ path: '.env.local' });

logger.log('🔧 Configurando entorno de desarrollo local...');
logger.log('✅ Variables de entorno cargadas desde .env.local');

const nest = spawn('npx', ['nest', 'start', '--watch'], {
  stdio: 'inherit',
  env: process.env,
});

nest.on('close', (code) => {
  if (code === 0) {
    logger.log('🔴 Backend cerrado correctamente');
  } else {
    logger.error(`🔴 Backend cerrado con código de error: ${code}`);
  }
});