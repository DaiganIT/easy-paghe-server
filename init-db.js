import { UnitOfWorkFactory } from './database/unitOfWorkFactory';
import { UserManager } from './managers/userManager';

async function initDb() {
  const db = await UnitOfWorkFactory.createAsync();
  db.synchronize();

  // create first user
  const userManager = new UserManager(db);
  await userManager.addAsync({});

  db.close();
}

initDb();
