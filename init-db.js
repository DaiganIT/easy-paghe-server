import bcrypt from 'bcrypt';
import { UnitOfWorkFactory } from './database/unitOfWorkFactory';
import { User } from './entities/user';

async function initDb() {
  const db = await UnitOfWorkFactory.createAsync();
  await db.synchronize();

  // create first user
  const user = new User();
  user.active = true;
  user.email = 'admin@easypaghe.it';
  user.name = 'Administrator';
  user.password = await bcrypt.hash('admin', 10);
  user.type = 'Administrator';

  await db.getRepository(User).save(user);
  await db.close();
}

initDb();
