import createDb from './testUnitOfWork';
import { Customer } from 'Entities/customer';
import { CCNL } from 'entities/ccnl';

const testCcnl = {
	name: 'test ccnl',
	originalDate: '2018-01-01',
	startDate: '2018-01-01',
	endDate: '2018-12-01',
	weekHours: 10,
	holidays: 30,
	extra: 1,
	night: 1,
	bankHolidays: 1,
	extraBankHolidays: 1,
	nightBankHolidays: 1,
	months: 13,
	salaryTable: [
		{ isApprentice: true, level: 'level a', baseSalary: 1200, contingency: 0, thirdElement: 0, seniority: 0, hh: 150, gg: 26 },
		{ isApprentice: true, level: 'level b', baseSalary: 1200, contingency: 0, thirdElement: 0, seniority: 0, hh: 150, gg: 26 },
		{ isApprentice: false, level: 'level a', baseSalary: 1200, contingency: 0, thirdElement: 0, seniority: 0, hh: 150, gg: 26 },
		{ isApprentice: false, level: 'level b', baseSalary: 1200, contingency: 0, thirdElement: 0, seniority: 0, hh: 150, gg: 26 }
	]
}

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

export async function givenIHaveBasicDataAsync() {
	const db = await createDb();

	await db.getRepository(CCNL).save(testCcnl);

	await db.close();
}
