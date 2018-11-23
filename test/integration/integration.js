import createDb from './testUnitOfWork';
import { Customer } from 'Entities/customer';

function givenIHaveADatabase() {
	before('GIVEN I have a database', async function() {
		this.timeout(60000);
		let db = await createDb('sys');
		try {
			await db.query('DROP SCHEMA `easy-paghe-test`');
		} catch (err) {}
		await db.query('CREATE SCHEMA `easy-paghe-test`');
		await db.close();

		db = await createDb();
		await db.synchronize();
		await db.close();
	});
}

function givenIHaveACustomer() {
	before('GIVEN I have a customer', async function() {
		const db = await createDb();

		let testCustomer = new Customer();
		testCustomer.name = 'Test Customer';

		testCustomer = await db.manager.save(testCustomer);
		await db.close();
	});
}

export const steps = {
	givenIHaveACustomer,
	givenIHaveADatabase,
};
