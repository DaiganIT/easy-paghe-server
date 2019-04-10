import { UnitOfWorkFactory } from '../database/unitOfWorkFactory';
import { BaseCustomerManager } from './baseCustomerManager';
import { Person } from '../entities/person';

export class PersonManager extends BaseCustomerManager {
	/**
	 * Creates a new {PersonManager}.
	 * @param {User} user The user.
	 */
	constructor(user) {
		super(user);
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

		await super.saveAsync(Person, person);
		return person;
	}

	/**
	 * Updates a new person.
	 * @param {AddPersonDto} personModel
	 */
	async updateAsync(id, personModel) {
		validatePerson(personModel);

		const person = await this.getByIdAsync(id);
		person.name = personModel.name;
		person.phone = personModel.phone;
		person.address = personModel.address;
		person.email = personModel.email;

		await super.saveAsync(Person, person);
		return person;
	}

	/**
	 * Gets a list of people for the current user
	 * @param {string} filter Text search string.
	 * @param {number} page Page number.
	 * @param {number} pageLimit Number of element per page.
	 */
	async getAsync(filter, page, pageLimit) {
		page = page || 0;
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
		return await super.getByIdAsync(Person, 'person', id, (queryBuilder) => {
			return getQueryBuilder(queryBuilder);
		});
	}

	/**
	 * Deletes the person by id.
	 * @param {number} id The person id.
	 */
	async deleteAsync(id) {
		return await super.deleteAsync(Person, 'person', id);
	}

	/**
	 * Deletes a range of people with a single query.
	 * @param {Person[] | {id:number}[] } people An array of person or an array of objects with only the id.
	 */
	async deleteRangeAsync(people) {
		return await super.deleteRangeAsync(Person, 'person', (queryBuilder) => {
			return queryBuilder
				.where('person.id in (:ids)', { ids: people.map(p => p.id) });
		});
	}

	/**
	 * Deletes a range of people with a single query.
	 * @param {Person[] | {id:number}[] } people An array of person or an array of objects with only the id.
	 */
	async detachRangeAsync(people) {
		for(const person of people)
			person.companyBase = null;

		return await super.saveAsync(Person, people);
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

function getQueryBuilder(queryBuilder) {
	return queryBuilder
		.leftJoinAndSelect('person.companyBase', 'companyBase');
}