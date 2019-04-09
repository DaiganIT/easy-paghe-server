import { BaseManager } from './baseManager';
import { SelectQueryBuilder } from 'typeorm';
import { isArray } from 'util';

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
		if (!customer)
			throw 'Customer is not defined';

		this.customer = customer;
	}

	getCustomer() {
		return this.customer;
	}

	/**
	 * Saves the entity.
	 * @param {string} target The target entity.
	 * @param {CustomerSpecific | CustomerSpecific[]} entities The entities to save.
	 */
	async saveAsync(target, entities) {
		if (isArray(entities)) {
			for (const entity of entities) {
				if (!entity.id)
					entity.customer = this.customer;
			}
		} else {
			if (!entities.id)
				entities.customer = this.customer;
		}

		await super.saveAsync(target, entities);
	}

	/**
	 * The queryBuilder addon
	 *
	 * @callback queryBuilderFunc
	 * @param {SelectQueryBuilder} queryBuilderFunc.queryBuilder The optional query builder func.
	 */
	/**
	 * Gets a list of company for the current user
	 * @param {string} target The target entity.
	 * @param {string} alias The main table alias.
	 * @param {number} page Page number.
	 * @param {number} pageLimit Number of element per page.
	 * @param {queryBuilderFunc} queryBuilderFunc The query builder.
	 */
	async getAsync(target, alias, page, pageLimit, queryBuilderFunc) {
		return await super.getAsync(target, alias, page, pageLimit, (queryBuilder) => {
			queryBuilder = customerQueryBuilder(alias, queryBuilder, this.customer.id);

			if (queryBuilderFunc)
				queryBuilder = queryBuilderFunc(queryBuilder);

			return queryBuilder;
		});
	}

	/**
	 * Gets an entity by id.
	 * @param {string} target The target entity.
	 * @param {string} alias The main alias.
	 * @param {number} id The entity identifier.
	 * @param {queryBuilderFunc} queryBuilderFunc The query builder.
	 */
	async getByIdAsync(target, alias, id, queryBuilderFunc) {
		return await super.getByIdAsync(target, alias, id, (queryBuilder) => {
			queryBuilder = customerQueryBuilder(alias, queryBuilder, this.customer.id);

			if (queryBuilderFunc)
				queryBuilder = queryBuilderFunc(queryBuilder);

			return queryBuilder;
		});
	}

	/**
	 * Deletes the entity by id.
	 * @param {string} target The target entity.
	 * @param {string} alias The main alias.
	 * @param {number} id The user id.
	 */
	async deleteAsync(target, alias, id) {
		return await super.deleteAsync(target, alias, id);
	}
}

function customerQueryBuilder(alias, queryBuilder, customerId) {
	return queryBuilder
		.innerJoinAndSelect(`${alias}.customer`, 'customer', 'customer.id = :customerId', { customerId: customerId });
}