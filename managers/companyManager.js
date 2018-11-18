import validate from 'validate.js';
import { SelectQueryBuilder } from 'typeorm';
import { Company } from '../entities/company';
import { BaseCustomerManager } from './baseCustomerManager';
import { PersonManager } from './personManager';
import { Person } from '../entities/person';
import { UnitOfWorkFactory } from '../database/unitOfWorkFactory';
import addCompanyValidator from '../models/validators/addCompanyValidator';

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
	 * @param {AddCompanyDto} companyModel
	 */
	async addAsync(companyModel) {
		const errors = validate(companyModel, addCompanyValidator)
		if (errors) throw errors;

		const company = new Company();
		company.name = companyModel.name;
		company.fiscalCode = companyModel.fiscalCode;
		company.ivaCode = companyModel.ivaCode;
		company.address = companyModel.address;
		company.inpsRegistrationNumber = companyModel.inpsRegistrationNumber;
		company.inailRegistrationNumber = companyModel.inailRegistrationNumber;

		await super.saveAsync(Company, company);
		return company;
	}

	/**
	 * Updates an existing company
	 * @param {AddCompanyDto} companyModel
	 */
	async updateAsync(id, companyModel) {
		validateCompany(companyModel);

		const company = await this.getByIdAsync(id);
		ompany.name = companyModel.name;
		company.fiscalCode = companyModel.fiscalCode;
		company.ivaCode = companyModel.ivaCode;
		company.address = companyModel.address;
		company.inpsRegistrationNumber = companyModel.inpsRegistrationNumber;
		company.inailRegistrationNumber = companyModel.inailRegistrationNumber;

		await super.saveAsync(Company, company);
		return company;
	}

	/**
	 * Gets a list of company for the current user
	 * @param {string} filter Text search string.
	 * @param {number} page Page number.
	 * @param {number} pageLimit Number of element per page.
	 */
	async getAsync(filter, page, pageLimit) {
		page = page || 0;
		pageLimit = pageLimit || 10;

		return await super.getAsync(Company, 'company', page, pageLimit, (queryBuilder) => {
			if (filter)
				queryBuilder.where(
					'company.name like :filter or company.address like :filter',
					{ filter: `%${filter}%` },
				);

			return queryBuilder;
		});
	}

	async getEmployeesAsync(id, filter, page, pageLimit) {
		page = page || 0;
		pageLimit = pageLimit || 10;

		return await super.getAsync(
			Person,
			'person',
			page,
			pageLimit,
			/** @param {SelectQueryBuilder} queryBuilder */ (queryBuilder) => {
				queryBuilder = queryBuilder.innerJoin('person.company', 'company', 'company.id = :companyId', {
					companyId: id,
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

	async addEmployeeAsync(id, employeeId) {
		const company = await this.getByIdAsync(id);
		const personManager = new PersonManager(super.getCustomer());
		const employee = await personManager.getByIdAsync(employeeId);

		if (!employee || !company) return null;

		employee.company = company;
		const db = await UnitOfWorkFactory.createAsync();
		await db.getRepository(Person).save(employee);
	}

	async removeEmployeeAsync(id, employeeId) {
		const company = await this.getByIdAsync(id);
		const personManager = new PersonManager(super.getCustomer());
		const employee = await personManager.getByIdAsync(employeeId);

		if (!employee || !company) return null;

		employee.company = null;
		const db = await UnitOfWorkFactory.createAsync();
		await db.getRepository(Person).save(employee);
	}

	/**
	 * Gets a company by id.
	 * @param {number} id The
	 */
	async getByIdAsync(id) {
		return await super.getByIdAsync(Company, 'company', id);
	}

	/**
	 * Deletes the company by id.
	 * @param {number} id The user id.
	 */
	async deleteAsync(id) {
		return await super.deleteAsync(Company, 'company', id);
	}
}

function isNotNullString(str) {
	if (str === undefined || str === null) return false;
	return str.length >= 0;
}
