import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/db.js';

async function connectWithRetry(retries = 5, delayMs = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await prisma.$connect();
      console.log('Database connected');
      return true;
    } catch (e) {
      console.error('DB attempt ' + i + '/' + retries + ' failed: ' + String(e.message).split('\n')[0]);
      if (i < retries) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return false;
}

async function main() {
  const dbOk = await connectWithRetry();
  if (!dbOk) {
    console.warn('WARNING: starting WITHOUT database. Health check works, DB queries will fail until connection returns.');
  }

  app.listen(env.port, () =>
    console.log('PlacementHub API -> http://localhost:' + env.port)
  );
}

main().catch((e) => { console.error(e); process.exit(1); });
