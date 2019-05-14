import fs from 'fs';
import {promisify} from 'util';
import moment from 'moment';

import { UnitOfWorkFactory } from './database/unitOfWorkFactory';
import { CCNL } from './entities/ccnl';
import { SalaryTable } from 'entities/salaryTable';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

function createCCNL(fileContent) {
	const ccnlFromFile = JSON.parse(fileContent);
	const ccnl = Object.assign(new CCNL(), ccnlFromFile);

	delete ccnl.maxWeekHours;
	delete ccnl.maxDays;
	delete ccnl.maxTotalExtraHoursPerYear;
	delete ccnl.maxExtraPerDay;
	delete ccnl.maxExtraPerWeek;
	delete ccnl.restDay;
	delete ccnl.extraHolidays;
	delete ccnl.prizes;

	ccnl.salaryTable = ccnl.salaryTable.map(row => Object.assign(new SalaryTable(), row));

	return ccnl;
}

async function seedDb() {
	const db = await UnitOfWorkFactory.createAsync();

	const filenames = await readdir('./ccnl');
	for(const filename of filenames) {
		const fileContent = await readFile('./ccnl/' + filename, 'utf-8');
		await db.getRepository(CCNL).save(createCCNL(fileContent));
	}

	await db.close();
}

seedDb();