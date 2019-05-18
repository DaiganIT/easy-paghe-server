import validate from 'validate.js';
import { Company } from '../entities/company';
import { History } from '../entities/history';
import { CompanyBase } from '../entities/companyBase';
import { BaseCustomerManager } from './baseCustomerManager';
import { PersonManager } from './personManager';
import { Person } from '../entities/person';
import { UnitOfWorkFactory } from '../database/unitOfWorkFactory';
import addCompanyValidator from '../models/validators/addCompanyValidator';
import addCompanyBaseValidator from '../models/validators/addCompanyBaseValidator';
import { HistoryManager } from './historyManager';
import { HistoryType } from 'entities/history';

export class CompanyManager extends BaseCustomerManager {
	/**
	 * Creates a new {CompanyManager}.
	 * @param {User} user The user.
	 */
	constructor(user) {
		super(user);
		this.historyManager = new HistoryManager(user);
	}

	/**
	 * Creates a new company.
	 * @param {AddCompanyDto} companyModel The company create model.
	 * @throws for validation.
	 */
	async addAsync(companyModel) {
		validateModel(companyModel);

		const company = new Company();
		const history = new History();
		mapCompany(company, companyModel, this.customer);

		history.entity = 'Company';
		history.type = HistoryType.Create;
		history.entityWasJson = '';

		await super.saveAsync(Company, company);
		history.entityIsJson = JSON.stringify(company);
		history.itemId = company.id;
		await this.historyManager.addAsync([history]);
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

		const history = new History();
		history.entity = 'Company';
		history.type = HistoryType.Update;
		history.entityWasJson = JSON.stringify(company);
		history.itemId = company.id;
		mapCompany(company, companyModel, this.customer);

		await super.saveAsync(Company, company);
		history.entityIsJson = JSON.stringify(company);
		await this.historyManager.addAsync([history]);
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
	 * Gets a list of company bases for the current user and the given company.
	 * @param {number} companyId The company id.
	 * @param {string} filter Text search string.
	 * @param {number} page Page number.
	 * @param {number} pageLimit Number of element per page.
	 */
	async getBasesAsync(companyId, filter, page, pageLimit) {
		return await super.getAsync(CompanyBase, 'company_base', page, pageLimit, (queryBuilder) => {
			queryBuilder.where('company_base.company = :companyId', { companyId });
			
			if (filter)
				queryBuilder.andWhere(
					`(company_base.name like :filter
					or company_base.address like :filter)`,
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
					.innerJoin('person.hire', 'hire')
					.innerJoin('hire.companyBase', 'company_base', 'company_base.id = person.companyBase && company_base.company = :companyId', {
						companyId: companyId,
					});
				if (filter)
					queryBuilder = queryBuilder.where(
						`person.firstName like :filter 
						or person.lastName like :filter 
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
					.innerJoin('person.hire', 'hire')
					.innerJoin('person.companyBase', 'companyBase', 'companyBase.id = :companyBaseId', {
						companyBaseId: companyBaseId,
					});
				if (filter)
					queryBuilder = queryBuilder.where(
						'person.firstName like :filter or person.lastName like :filter or person.address like :filter or person.phone like :filter or person.email like :filter',
						{ filter: `%${filter}%` },
					);

				return queryBuilder;
			},
		);
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
					.leftJoinAndSelect('company_base.hirees', 'hire');
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
		const personManager = new PersonManager(super.getUser());
		const company = await this.getByIdAsync(companyId, true);

		const companyWithNoEmployees = Object.assign({}, company);
		companyWithNoEmployees.bases = companyWithNoEmployees.bases.map(base => ({ ...base, hirees: undefined }));
		const history = new History();
		history.entity = 'Company';
		history.type = HistoryType.Delete;
		history.entityWasJson = JSON.stringify(companyWithNoEmployees);
		history.itemId = company.id;

		for (const companyBase of company.bases) {
			if (companyBase.hirees.length > 0) {
				if (withEmployees) {
					await personManager.deleteRangeAsync(companyBase.hirees.map(h => h.person));
				} else {
					await personManager.detachRangeAsync(companyBase.hirees.map(h => h.person));
				}
			}
		}

		await super.deleteAsync(Company, 'company', companyId);
		history.entityIsJson = '';
		await this.historyManager.addAsync([history]);
	}

	/**
		 * Deletes the company base by id.
	 * @param {number} companyBaseId The company base id.
	 * @param {boolean} withEmployees If true the employees will be deleted with the company. If false they will just become unemployed.
	 */
	async deleteBaseAsync(companyBaseId, withEmployees) {
		const personManager = new PersonManager(super.getUser());
		const companyBase = await this.getBaseByIdAsync(companyBaseId, true);

		const company = await this.getByIdAsync(companyBase.company.id, false);
		const history = new History();
		history.entity = 'Company';
		history.type = HistoryType.Update;
		history.entityWasJson = JSON.stringify(company);
		history.itemId = company.id;

		if (companyBase.hirees.length > 0) {
			if (withEmployees) {
				await personManager.deleteRangeAsync(companyBase.hirees.map(h => h.person));
			} else {
				await personManager.detachRangeAsync(companyBase.hirees.map(h => h.person));
			}
		}

		await super.deleteAsync(CompanyBase, 'company_base', companyBaseId);
		const updatedCompany = await this.getByIdAsync(companyBase.company.id, false);
		history.entityIsJson = JSON.stringify(updatedCompany);
		await this.historyManager.addAsync([history]);
	}
}

function getQueryBuilder(queryBuilder, withEmployees) {
	queryBuilder = queryBuilder
		.leftJoinAndSelect('company.bases', 'company_base')
		.innerJoinAndSelect('company_base.customer', 'company_base_customer');

	if (withEmployees) {
		queryBuilder = queryBuilder
			.leftJoinAndSelect('company_base.hirees', 'hire')
			.leftJoinAndSelect('hire.person', 'person');
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