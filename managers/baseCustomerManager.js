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
	 * Gets an entity by id.
	 * @param {string} target The target entity.
	 * @param {number} id The entity identifier.
	 */
	async getByIdAsync(target, id) {
		return await super.getByIdAsync(target, id, { customerId: this.customer.Id });
	}

	/**
	 * Deletes the entity by id.
	 * @param {string} target The target entity.
	 * @param {number} id The user id.
	 */
	async deleteAsync(target, id) {
		await super.deleteAsync(target, id, { customerId: this.customer.Id });
	}
}
