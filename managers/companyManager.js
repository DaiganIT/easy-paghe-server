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
					or companyBase.name like :filter
					or companyBase.address like :filter`,
					{ filter: `%${filter}%` },
				);

			return queryBuilder;
		});
	}

	async getBasesAsync(companyId, filter, page, pageLimit) {
		page = page || 0;
		pageLimit = pageLimit || 10;

		return await super.getAsync(
			CompanyBase,
			'companyBase',
			page,
			pageLimit,
			(queryBuilder) => {
				queryBuilder = queryBuilder.where('companyBase.company = :companyId', {
					companyId: companyId,
				});
				if (filter)
					queryBuilder = queryBuilder.andWhere(
						'companyBase.name like :filter or companyBase.address like :filter',
						{ filter: `%${filter}%` },
					);

				return queryBuilder;
			},
		);
	}

	async getAllEmployeesAsync(companyId, filter, page, pageLimit) {
		page = page || 0;
		pageLimit = pageLimit || 10;

		return await super.getAsync(
			Person,
			'person',
			page,
			pageLimit,
			(queryBuilder) => {
				queryBuilder = queryBuilder
					.innerJoin('person.companyBase', 'companyBase', 'companyBase.id = person.companyBase')
					.innerJoin('companyBase.company', 'company', 'company.id = :companyId', {
						companyId: companyId,
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

	async getBaseEmployeesAsync(companyBaseId, filter, page, pageLimit) {
		page = page || 0;
		pageLimit = pageLimit || 10;

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

	async addEmployeeAsync(companyBaseId, employeeId) {
		const companyBase = await this.getBaseByIdAsync(companyBaseId);
		const personManager = new PersonManager(super.getCustomer());
		const employee = await personManager.getByIdAsync(employeeId);

		if (!employee || !companyBase) return null;

		employee.companyBase = companyBase;
		const db = await UnitOfWorkFactory.createAsync();
		await db.getRepository(Person).save(employee);
	}

	async removeEmployeeAsync(companyBaseId, employeeId) {
		const companyBase = await this.getBaseByIdAsync(companyBaseId);
		const personManager = new PersonManager(super.getCustomer());
		const employee = await personManager.getByIdAsync(employeeId);

		if (!employee || !companyBase) return null;

		employee.companyBase = null;
		const db = await UnitOfWorkFactory.createAsync();
		await db.getRepository(Person).save(employee);
	}

	/**
	 * Gets a company by id.
	 * @param {number} companyId The copmany id.
	 */
	async getByIdAsync(companyId) {
		return await super.getByIdAsync(Company, 'company', companyId, (queryBuilder) => {
			return getQueryBuilder(queryBuilder);
		});
	}

	/**
	 * Gets a company base by id.
	 * @param {number} companyBaseId The base id.
	 */
	async getBaseByIdAsync(companyBaseId) {
		return await super.getByIdAsync(CompanyBase, 'companyBase', companyBaseId);
	}

	/**
	 * Deletes the company by id.
	 * @param {number} companyId The user id.
	 */
	async deleteAsync(companyId) {
		// detach all employees first I guess.
		return await super.deleteAsync(Company, 'company', companyId);
	}
}

function getQueryBuilder(queryBuilder) {
	return queryBuilder
		.innerJoinAndSelect('company.bases', 'companyBase', 'company.id = companyBase.company');
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