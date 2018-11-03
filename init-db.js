import bcrypt from 'bcrypt';
import { UnitOfWorkFactory } from './database/unitOfWorkFactory';
import { User } from './entities/user';
import { Customer } from './entities/customer';

async function initDb() {
	const db = await UnitOfWorkFactory.createAsync();
	await db.synchronize();

	// create admin customer
	const customer = new Customer();
	customer.name = 'Administrator';

	await db.getRepository(Customer).save(customer);

	// create first user
	const user = new User();
	user.active = true;
	user.email = 'admin@easypaghe.it';
	user.name = 'Administrator';
	user.password = await bcrypt.hash('admin', 10);
  user.type = 'Administrator';
  user.customer = customer;

	await db.getRepository(User).save(user);

	await db.close();
}

initDb();
