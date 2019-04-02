import createDb from './testUnitOfWork';
import { Customer } from 'Entities/customer';

export async function givenIHaveADatabaseAsync() {
	let db = await createDb('sys');
	try {
		await db.query('DROP SCHEMA `easy-paghe-test`');
	} catch (err) { }
	await db.query('CREATE SCHEMA `easy-paghe-test`');
	await db.close();

	db = await createDb();
	await db.synchronize();
	await db.close();
}

export async function givenIHaveACustomerAsync() {
	const db = await createDb();

	let testCustomer = new Customer();
	testCustomer.name = 'Test Customer';

	testCustomer = await db.getRepository(Customer).save(testCustomer);
	await db.close();
}
