import { Company } from '../entities/company';
import { BaseCustomerManager } from './baseCustomerManager';

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

		super.saveAsync(Company, company);
	}

	/**
	 * Gets a company by id.
	 * @param {number} id The 
	 */
	async getByIdAsync(id) {
		return await super.getByIdAsync(Company, id);
	}

	/**
	 * Deletes the company by id.
	 * @param {number} id The user id.
	 */
	async deleteAsync(id) {
		return await super.deleteAsync(Company, id);
	}
}

/**
 * Validates the company dto.
 * @param {AddCompanyDto} company The company dto to validate.
 */
function validateCompany(company) {
	const errors = [];
	if (errors.length > 0) throw errors;
}
