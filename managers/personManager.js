import validate from 'validate.js';
import { BaseCustomerManager } from './baseCustomerManager';
import { Person } from '../entities/person';
import { History } from '../entities/history';
import addPersonValidator from '../models/validators/addPersonValidator';
import { HistoryManager } from './historyManager';
import { HistoryType } from 'entities/history';

export class PersonManager extends BaseCustomerManager {
	/**
	 * Creates a new {PersonManager}.
	 * @param {User} user The user.
	 */
	constructor(user) {
		super(user);
		this.historyManager = new HistoryManager(user);

	}

	/**
	 * Creates a new person.
	 * @param {AddPersonDto} personModel
	 */
	async addAsync(personModel) {
		validateModel(personModel);

		const person = new Person();
		const history = new History();
		mapPerson(person, personModel);
		history.entity = 'Person';
		history.type = HistoryType.Create;
		history.entityWasJson = '';

		await super.saveAsync(Person, person);
		history.entityIsJson = JSON.stringify(person);
		history.itemId = person.id;
		await this.historyManager.addAsync([history]);
		return person;
	}

	/**
	 * Updates a new person.
	 * @param {AddPersonDto} personModel
	 */
	async updateAsync(id, personModel) {
		validateModel(personModel);

		const person = await this.getByIdAsync(id);
		const history = new History();
		history.entity = 'Person';
		history.type = HistoryType.Update;
		history.entityWasJson = JSON.stringify(person);
		history.itemId = id,
		mapPerson(person, personModel);

		await super.saveAsync(Person, person);
		history.entityIsJson = JSON.stringify(person);
		await this.historyManager.addAsync([history]);
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
					.where('person.firstName like :filter or person.lastName like :filter or person.address like :filter or person.phone like :filter or person.email like :filter', { filter: `%${filter}%` });

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
		const person = await this.getByIdAsync(id);

		const history = new History();
		history.entity = 'Person';
		history.type = HistoryType.Delete;
		history.entityWasJson = JSON.stringify(person);
		history.itemId = id,
			await super.deleteAsync(Person, 'person', id);
		history.entityIsJson = '';
		await this.historyManager.addAsync([history]);
	}

	/**
	 * Deletes a range of people with a single query.
	 * @param {Person[] | {id:number}[] } people An array of person or an array of objects with only the id.
	 */
	async deleteRangeAsync(people) {
		const peopleDb = await super.getAsync(Person, 'person', 1, 100000, (queryBuilder) => {
			return queryBuilder
				.where('person.id in (:ids)', { ids: people.map(p => p.id) });
		});

		const histories = peopleDb.items.map(person => ({
			entity: 'Person',
			type: HistoryType.Delete,
			entityWasJson: JSON.stringify(person),
			entityIsJson: '',
			itemId: person.id
		}));

		await super.deleteRangeAsync(Person, 'person', (queryBuilder) => {
			return queryBuilder
				.where('person.id in (:ids)', { ids: people.map(p => p.id) });
		});

		await this.historyManager.addAsync(histories);
	}

	/**
	 * Deletes a range of people with a single query.
	 * @param {Person[] | {id:number}[] } people An array of person or an array of objects with only the id.
	 */
	async detachRangeAsync(people) {
		const peopleDb = await super.getAsync(Person, 'person', 1, 100000, (queryBuilder) => {
			return queryBuilder
				.where('person.id in (:ids)', { ids: people.map(p => p.id) });
		});

		let histories = peopleDb.items.map(person => ({
			entity: 'Person',
			type: HistoryType.Delete,
			entityWasJson: JSON.stringify(person),
			entityIsJson: JSON.stringify(Object.assign({}, person, { companyBase: null })),
			itemId: person.id
		}));

		for (const person of people)
			person.companyBase = null;

		await super.saveAsync(Person, people);
		await this.historyManager.addAsync(histories);
	}
}

/**
 * Validates the person dto.
 * @param {AddPersonDto} personModel The person dto to validate.
 */
function validateModel(personModel) {
	let errors;
	const modelErrors = validate(personModel, addPersonValidator);
	if (modelErrors) errors = Object.assign({}, errors, modelErrors);
	if (errors) throw errors;
}

function mapPerson(person, personModel) {
	person.firstName = personModel.firstName;
	person.lastName = personModel.lastName;
	person.phone = personModel.phone;
	person.address = personModel.address;
	person.email = personModel.email;
}

function getQueryBuilder(queryBuilder) {
	return queryBuilder
		.leftJoinAndSelect('person.companyBase', 'companyBase');
}