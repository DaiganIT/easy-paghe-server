import { SelectQueryBuilder } from 'typeorm';
import { Company } from '../entities/company';
import { BaseCustomerManager } from './baseCustomerManager';
import { PersonManager } from './personManager';
import { Person } from '../entities/person';
import { UnitOfWorkFactory } from '../database/unitOfWorkFactory';

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
		validateCompany(companyModel);

		const company = new Company();
		company.name = companyModel.name;
		company.phone = companyModel.phone;
		company.address = companyModel.address;

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
		company.name = companyModel.name;
		company.phone = companyModel.phone;
		company.address = companyModel.address;

		super.saveAsync(Company, company);
	}

	/**
	 * Gets a list of company for the current user
	 * @param {string} filter Text search string.
	 * @param {number} page Page number.
	 * @param {number} pageLimit Number of element per page.
	 */
	async getAsync(filter, page, pageLimit) {
		page = page || 1;
		pageLimit = pageLimit || 10;

		return await super.getAsync(Company, 'company', page, pageLimit, (queryBuilder) => {
			if (filter)
				queryBuilder.where(
					'company.name like :filter or company.address like :filter or company.phone like :filter',
					{ filter: `%${filter}%` },
				);

			return queryBuilder;
		});
	}

	async getEmployeesAsync(id, filter, page, pageLimit) {
		page = page || 1;
		pageLimit = pageLimit || 10;

		return await super.getAsync(
			Person,
			'person',
			page,
			pageLimit,
			/** @param {SelectQueryBuilder} queryBuilder */ (queryBuilder) => {
				if (filter)
					queryBuilder
						.innerJoin('person.company', 'company', 'company.id = :id', { id: id })
						.where(
							'person.name like :filter or company.address like :filter or company.phone like :filter or company.email like :filter',
							{ filter: `%${filter}%` },
						);

				return queryBuilder;
			},
		);
	}

	async addEmployeeAsync(id, employeeId) {
		const db = UnitOfWorkFactory.createAsync();
		try {
			const company = await this.getByIdAsync(id);
			const personManager = new PersonManager(super.getCustomer());
			const employee = personManager.getByIdAsync(employeeId);

			if (!employee || !company) return null;

			employee.company = await this.getByIdAsync(id);
			await db.save(employee);
			return employee;
		} finally {
			await db.close();
		}
	}

	async removeEmployeeAsync(id, employeeId) {
		const db = UnitOfWorkFactory.createAsync();
		try {
			const company = await this.getByIdAsync(id);
			const personManager = new PersonManager(super.getCustomer());
			const employee = personManager.getByIdAsync(employeeId);

			if (!employee || !company) return null;

			employee.company = null;
			await db.save(employee);
			return employee;
		} finally {
			await db.close();
		}
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

/**
 * Validates the company dto.
 * @param {AddCompanyDto} company The company dto to validate.
 */
function validateCompany(company) {
	const errors = [];

	if (!company.name)
		errors.push({ name: 'name' });

	if (errors.length > 0) throw errors;
}
