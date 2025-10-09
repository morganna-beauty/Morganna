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
logger.log(`🚀 Iniciando NestJS en modo desarrollo...`);

const nest = spawn('npm', ['run', 'start:dev'], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

nest.on('error', (error) => {
  logger.error(`Error al iniciar el proceso: ${error.message}`);
  logger.error('Asegúrate de que Node.js y npm estén instalados correctamente');
  process.exit(1);
});

nest.on('close', (code) => {
  if (code === 0) {
    logger.log('🔴 Backend cerrado correctamente');
  } else {
    logger.error(`🔴 Backend cerrado con código de error: ${code}`);
  }
});