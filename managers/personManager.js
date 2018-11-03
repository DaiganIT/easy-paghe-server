import { BaseCustomerManager } from './baseCustomerManager';
import { Person } from '../entities/person';

export class PersonManager extends BaseCustomerManager {
	/**
	 * Creates a new {PersonManager}.
	 * @param {Customer} customer The customer id.
	 */
	constructor(customer) {
		super(customer);
	}

	/**
	 * Creates a new person.
	 * @param {AddPersonDto} personModel
	 */
	async addAsync(personModel) {
		validatePerson(personModel);

		const person = new Person();
		person.name = personModel.name;
		person.phone = personModel.phone;
		person.address = personModel.address;
		person.email = personModel.email;

		super.saveAsync(Person, person);
	}

	/**
	 * Gets a list of people for the current user
	 * @param {string} filter Text search string.
	 * @param {number} page Page number.
	 * @param {number} pageLimit Number of element per page.
	 */
	async getAsync(filter, page, pageLimit) {
		page = page || 1;
		pageLimit = pageLimit || 10;

		return await super.getAsync(Person, 'person', page, pageLimit, (queryBuilder) => {
			if (filter)
				queryBuilder
					.where('person.name like :filter or person.address like :filter or person.phone like :filter or person.email like :filter', { filter: `%${filter}%`});

			return queryBuilder;
		});
	}

	/**
	 * Gets a person by id.
	 * @param {number} id The person id.
	 */
	async getByIdAsync(id) {
		return await super.getByIdAsync(Person, 'person', id);
	}

	/**
	 * Deletes the person by id.
	 * @param {number} id The person id.
	 */
	async deleteAsync(id) {
		return await super.deleteAsync(Person, 'person', id);
	}
}

/**
 * Validates the company dto.
 * @param {AddCompanyDto} company The company dto to validate.
 */
function validatePerson(company) {
	const errors = [];
	if (errors.length > 0) throw errors;
}
