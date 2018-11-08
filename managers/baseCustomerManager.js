import { BaseManager } from './baseManager';

export class BaseCustomerManager extends BaseManager {
	/**
	 * @type {Customer}
	 */
	customer;

	/**
	 * Creates a new {BaseCustomerManager}.
	 * @param {Customer} customer the Customer.
	 */
	constructor(customer) {
		super();
		this.customer = customer;
	}

	getCustomer() {
		return this.customer;
	}

	/**
	 * Saves the entity.
	 * @param {string} target The target entity.
	 * @param {CustomerSpecific} entity The entity to save.
	 */
	async saveAsync(target, entity) {
		entity.customer = this.customer;
		await super.saveAsync(target, entity);
	}

	/**
	 * Gets a list of company for the current user
	 * @param {string} target The target entity.
	 * @param {string} alias The main table alias.
	 * @param {string} filter Text search string.
	 * @param {number} page Page number.
	 * @param {number} pageLimit Number of element per page.
	 */
	async getAsync(target, alias, page, pageLimit, queryBuilderFunc) {
		return await super.getAsync(target, alias, page, pageLimit, (queryBuilder) => {
			queryBuilder = queryBuilder
				.innerJoin(`${alias}.customer`, 'customer', 'customer.id = :customerId', { customerId: this.customer.id });

			if(queryBuilderFunc)
				queryBuilder = queryBuilderFunc(queryBuilder);
				
			return queryBuilder;
		});
	}

	/**
	 * Gets an entity by id.
	 * @param {string} target The target entity.
	 * @param {string} alias The main alias.
	 * @param {number} id The entity identifier.
	 */
	async getByIdAsync(target, alias, id) {
		return await super.getByIdAsync(target, alias, id, (queryBuilder) => {
			return queryBuilder
				.innerJoin(`${alias}.customer`, 'customer', 'customer.id = :customerId', { customerId: this.customer.id });
		});
	}

	/**
	 * Deletes the entity by id.
	 * @param {string} target The target entity.
	 * @param {string} alias The main alias.
	 * @param {number} id The user id.
	 */
	async deleteAsync(target, alias, id) {
		return await super.deleteAsync(target, alias, id, (queryBuilder) => {
			return queryBuilder
				.innerJoin(`${alias}.customer`, 'customer', 'customer.id = :customerId', { customerId: this.customer.id });
		});
	}
}
