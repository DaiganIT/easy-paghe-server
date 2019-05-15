import validate from 'validate.js';
import { Hire } from '../entities/hire';
import { History } from '../entities/history';
import { CompanyBase } from '../entities/companyBase';
import { BaseCustomerManager } from './baseCustomerManager';
import hirePersonValidator from '../models/validators/hirePersonValidator';
import { HistoryManager } from './historyManager';
import { HistoryType } from 'entities/history';
import { UnitOfWorkFactory } from 'database';
import { Person } from 'entities/person';
import { CCNL } from 'entities/ccnl';
import { SalaryTable } from 'entities/salaryTable';

export class HireManager extends BaseCustomerManager {
	/**
	 * Creates a new {HireManager}.
	 * @param {User} user The user.
	 */
	constructor(user) {
		super(user);
    this.historyManager = new HistoryManager(user);
	}

	/**
	 * Hires a person.
	 * @param {HirePersonDto} hirePersonModel The hire person model.
	 * @throws for validation.
	 */
	async hirePersonAsync(hirePersonModel) {
		validateModel(hirePersonModel);

		const hire = new Hire();
		const history = new History();
		await mapHireAsync(hire, hirePersonModel, this.customer);

		history.entity = 'Hire';
		history.type = HistoryType.Create;
		history.entityWasJson = '';

		await super.saveAsync(Hire, hire);
		history.entityIsJson = JSON.stringify(hire);
		history.itemId = hire.id;
		await this.historyManager.addAsync([history]);
		return hire;
	}
}

/**
 * Maps the model into the entity.
 * @param {Hire} hire 
 * @param {HirePersonModel} hirePersonModel 
 * @param {Customer} customer 
 */
async function mapHireAsync(hire, hirePersonModel, customerId) {
  hire.startDate = hirePersonModel.startDate;
  hire.endDate = hirePersonModel.endDate;
  hire.holidays = hirePersonModel.holidays;
  hire.weekHours = hirePersonModel.weekHours;

	const db = await UnitOfWorkFactory.createAsync();
  // get company base
	const companyBase = await db.getRepository(CompanyBase).findOne(hirePersonModel.companyBaseId, { where: { customer: customerId } });
	if (!companyBase) throw 'Azienda non valida';
	
		// get person
	const person = await db.getRepository(Person).findOne(hirePersonModel.personId, { where: { customer: customerId } });
	if (!person) throw 'Persona non valida';

  // get ccnl
	const ccnl = await db.getRepository(CCNL).findOne(hirePersonModel.ccnlId);
	if (!ccnl) throw 'CCNL non valido';

  // get salary table
	const salaryTable = await db.getRepository(SalaryTable).findOne(hirePersonModel.salaryTableId);
	if (!salaryTable) throw 'Livello non valido';

  hire.companyBase = companyBase;
  hire.person = person;
  hire.ccnl = ccnl;
  hire.salaryTable = salaryTable;
}

function validateModel(hirePersonModel) {
	const errors = validate(hirePersonModel, hirePersonValidator);
	if (errors) throw errors;
}