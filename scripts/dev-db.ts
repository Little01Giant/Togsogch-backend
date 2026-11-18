// Local MongoDB for development when Docker/Atlas is unavailable.
import { MongoMemoryServer } from 'mongodb-memory-server';
import { mkdirSync } from 'fs';
import { join } from 'path';

async function main() {
  const dbPath = join(__dirname, '..', '.devdb');
  mkdirSync(dbPath, { recursive: true });
  const mongod = await MongoMemoryServer.create({
    instance: { port: 27017, dbPath, storageEngine: 'wiredTiger' },
  });
  console.log('MongoDB дээр ажиллаж байна:', mongod.getUri());
  const stop = async () => { await mongod.stop(); process.exit(0); };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}
main();
