import validate from 'validate.js';
import { Company } from '../entities/company';
import { CompanyBase } from '../entities/companyBase';
import { BaseCustomerManager } from './baseCustomerManager';
import { PersonManager } from './personManager';
import { Person } from '../entities/person';
import { UnitOfWorkFactory } from '../database/unitOfWorkFactory';
import addCompanyValidator from '../models/validators/addCompanyValidator';
import addCompanyBaseValidator from '../models/validators/addCompanyBaseValidator';

export class CompanyManager extends BaseCustomerManager {
	/**
	 * Creates a new {CompanyManager}.
	 * @param {Customer} customer The customer id.
	 */
	constructor(customer) {
		super(customer);
	}

	/**
	 * Creates a new company.
	 * @param {AddCompanyDto} companyModel The company create model.
	 * @throws for validation.
	 */
	async addAsync(companyModel) {
		validateModel(companyModel);

		const company = new Company();
		mapCompany(company, companyModel, this.customer);

		await super.saveAsync(Company, company);
		return company;
	}

	/**
	 * Updates an existing company.
	 * New bases will be added, but existing one won't be deleted.
	 * @param {number} companyId The company id.
	 * @param {AddCompanyDto} companyModel The company update model.
	 * @throws for validation or missing company or trying to delete a base.
	 */
	async updateAsync(id, companyModel) {
		const company = await this.getByIdAsync(id);
		if (!company)
			throw 'Azienda non trovata';

		if (!!companyModel.bases)
			if (companyModel.bases.length < company.bases.length || basesAreNotTheSame(companyModel.bases, company.bases))
				throw 'Aggiorna azienda non puo essere usato per eliminare sedi';

		validateModel(companyModel);
		mapCompany(company, companyModel, this.customer);

		await super.saveAsync(Company, company);
		return company;
	}

	/**
	 * Gets a list of company for the current user.
	 * @param {string} filter Text search string.
	 * @param {number} page Page number.
	 * @param {number} pageLimit Number of element per page.
	 */
	async getAsync(filter, page, pageLimit) {
		return await super.getAsync(Company, 'company', page, pageLimit, (queryBuilder) => {
			queryBuilder = getQueryBuilder(queryBuilder);
			if (filter)
				queryBuilder.where(
					`company.name like :filter
					or company.fiscalCode like :filter
					or company.ivaCode like :filter
					or company.inpsRegistrationNumber like :filter
					or company.inailRegistrationNumber like :filter
					or company_base.name like :filter
					or company_base.address like :filter`,
					{ filter: `%${filter}%` },
				);

			return queryBuilder;
		});
	}

	/**
	 * Gets the list of all the employees.
	 * @param {number} companyId The company Id.
	 * @param {string} filter Text search string.
	 * @param {number} page Page number.
	 * @param {number} pageLimit Number of element per page.
	 */
	async getAllEmployeesAsync(companyId, filter, page, pageLimit) {
		return await super.getAsync(
			Person,
			'person',
			page,
			pageLimit,
			(queryBuilder) => {
				queryBuilder = queryBuilder
					.innerJoin('person.companyBase', 'company_base', 'company_base.id = person.companyBase && company_base.company = :companyId', {
						companyId: companyId,
					});
				if (filter)
					queryBuilder = queryBuilder.where(
						`person.name like :filter 
						or person.address like :filter 
						or person.phone like :filter 
						or person.email like :filter`,
						{ filter: `%${filter}%` },
					);

				return queryBuilder;
			},
		);
	}

	/**
	 * Gets the list of employees for the base.
	 * @param {number} companyBaseId The company base id.
	 * @param {string} filter Text search string.
	 * @param {number} page Page number.
	 * @param {number} pageLimit Number of element per page.
	 */
	async getBaseEmployeesAsync(companyBaseId, filter, page, pageLimit) {
		return await super.getAsync(
			Person,
			'person',
			page,
			pageLimit,
			(queryBuilder) => {
				queryBuilder = queryBuilder
					.innerJoin('person.companyBase', 'companyBase', 'companyBase.id = :companyBaseId', {
						companyBaseId: companyBaseId,
					});
				if (filter)
					queryBuilder = queryBuilder.where(
						'person.name like :filter or person.address like :filter or person.phone like :filter or person.email like :filter',
						{ filter: `%${filter}%` },
					);

				return queryBuilder;
			},
		);
	}

	/**
	 * Adds the given person as an employee of company at the given base.
	 * @param {number} companyBaseId The company base id.
	 * @param {number} personId The person id.
	 */
	async addEmployeeAsync(companyBaseId, personId) {
		const companyBase = await this.getBaseByIdAsync(companyBaseId);
		const personManager = new PersonManager(super.getCustomer());
		const person = await personManager.getByIdAsync(personId);

		if (!person)
			throw 'Impossibile trovare la persona';

		if (person.companyBase) {
			// if person is only moving between bases of the same company, then it's ok
			const currentCompanyBase = await this.getBaseByIdAsync(person.companyBase.id);
			if (currentCompanyBase.company.id !== companyBase.company.id)
				throw 'Questo persona ha gia un altro lavoro';
		}

		if (!companyBase)
			throw 'Impossibile trovare la sede dell\'azienda';

		person.companyBase = companyBase;
		const db = await UnitOfWorkFactory.createAsync();
		await db.getRepository(Person).save(person);
	}

	async removeEmployeeAsync(employeeId) {
		const personManager = new PersonManager(super.getCustomer());
		const employee = await personManager.getByIdAsync(employeeId);

		if (!employee)
			throw 'Impossibile trovare la persona';

		if (!employee.companyBase)
			throw 'Questo persona non ha un lavoro';

		employee.companyBase = null;
		const db = await UnitOfWorkFactory.createAsync();
		await db.getRepository(Person).save(employee);
	}

	/**
	 * Gets a company by id.
	 * @param {number} companyId The copmany id.
	 */
	async getByIdAsync(companyId, withEmployees) {
		return await super.getByIdAsync(Company, 'company', companyId, (queryBuilder) => {
			return getQueryBuilder(queryBuilder, withEmployees);
		});
	}

	/**
	 * Gets a company base by id.
	 * @param {number} companyBaseId The base id.
	 */
	async getBaseByIdAsync(companyBaseId, withEmployees) {
		return await super.getByIdAsync(CompanyBase, 'company_base', companyBaseId, (queryBuilder) => {
			queryBuilder = queryBuilder
				.innerJoinAndSelect('company_base.company', 'company');

			if (withEmployees) {
				queryBuilder = queryBuilder
					.leftJoinAndSelect('company_base.employees', 'employee');
			}

			return queryBuilder;
		});
	}

	/**
	 * Deletes the company by id.
	 * @param {number} companyId The company id.
	 * @param {boolean} withEmployees If true the employees will be deleted with the company. If false they will just become unemployed.
	 */
	async deleteAsync(companyId, withEmployees) {
		const personManager = new PersonManager(super.getCustomer());
		const company = await this.getByIdAsync(companyId, true);
		for (const base of company.bases) {
			if (withEmployees) {
				await personManager.deleteRangeAsync(base.employees);
			} else {
				await personManager.detachRangeAsync(base.employees);
			}
		}

		return await super.deleteAsync(Company, 'company', companyId);
	}

	/**
 	 * Deletes the company base by id.
   * @param {number} companyBaseId The company base id.
	 * @param {boolean} withEmployees If true the employees will be deleted with the company. If false they will just become unemployed.
   */
	async deleteBaseAsync(companyBaseId, withEmployees) {
		const personManager = new PersonManager(super.getCustomer());
		const companyBase = await this.getBaseByIdAsync(companyBaseId, true);
		if (withEmployees) {
			await personManager.deleteRangeAsync(companyBase.employees);
		} else {
			await personManager.detachRangeAsync(companyBase.employees);
		}

		return await super.deleteAsync(CompanyBase, 'company_base', companyBaseId);
	}
}

function getQueryBuilder(queryBuilder, withEmployees) {
	queryBuilder = queryBuilder
		.leftJoinAndSelect('company.bases', 'company_base');

	if (withEmployees) {
		queryBuilder = queryBuilder
			.leftJoinAndSelect('company_base.employees', 'employee');
	}

	return queryBuilder;
}

function getBasesWithId(bases) {
	return bases.filter(base => base.id);
}

function basesAreNotTheSame(companyModelBases, companyBases) {
	var companyBasesWithId = getBasesWithId(companyBases);
	var companyModelBasesWithId = getBasesWithId(companyModelBases);
	return companyBasesWithId.length !== companyModelBasesWithId.length;
}

function mapCompany(company, companyModel, customer) {
	const bases = [];
	if (!!companyModel.bases) {
		for (const base of companyModel.bases) {
			let baseEntity;
			if (company.bases) {
				const basesById = company.bases && company.bases.filter(b => b.id === base.id);
				if (basesById.length === 1) {
					baseEntity = basesById[0];
				} else {
					baseEntity = new CompanyBase();
					baseEntity.customer = customer;
				}
			} else {
				baseEntity = new CompanyBase();
				baseEntity.customer = customer;
			}

			baseEntity.name = base.name;
			baseEntity.address = base.address;
			bases.push(baseEntity);
		}
	}

	company.name = companyModel.name;
	company.fiscalCode = companyModel.fiscalCode;
	company.ivaCode = companyModel.ivaCode;
	company.bases = bases;
	company.inpsRegistrationNumber = companyModel.inpsRegistrationNumber;
	company.inailRegistrationNumber = companyModel.inailRegistrationNumber;
}

function validateModel(companyModel) {
	let errors;
	const modelErrors = validate(companyModel, addCompanyValidator);
	if (modelErrors) errors = Object.assign({}, errors, modelErrors);

	if (!!companyModel.bases) {
		let index = 0;
		for (const base of companyModel.bases) {
			const baseErrors = validate(base, addCompanyBaseValidator);
			if (baseErrors) errors = Object.assign({}, errors, { bases: { [index]: baseErrors } });
			index++;
		}
	}
	if (errors) throw errors;

}