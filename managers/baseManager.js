import { UnitOfWorkFactory } from '../database/unitOfWorkFactory';
import { SelectQueryBuilder } from 'typeorm';

export class BaseManager {
	/**
	 * Saves the entity.
	 * @param {string} target The target entity.
	 * @param {any} entities The entities to save.
	 */
	async saveAsync(target, entities) {
		const db = await UnitOfWorkFactory.createAsync();
		await db.getRepository(target).save(entities);
	}

	/**
	 * Gets a list of entities
	 * @param {string} target The target entity.
	 * @param {string} alias The main table alias.
	 * @param {number} page The page number.
	 * @param {number} pageLimit The page limit.
	 * @param {queryBuilderFunc} queryBuilderFunc The optional query builder func.
	 */
	async getAsync(target, alias, page, pageLimit, queryBuilderFunc) {
		page = page || 1;
		pageLimit = pageLimit || 10;
		
		const db = await UnitOfWorkFactory.createAsync();
		let queryBuilder = db.getRepository(target).createQueryBuilder(alias);

		if (queryBuilderFunc) queryBuilder = queryBuilderFunc(queryBuilder);
		const length = await queryBuilder.getCount();
		const data = await queryBuilder
			.skip((page-1) * pageLimit)
			.take(pageLimit)
			.getMany();

		return {
			items: data,
			length: length,
		};
	}

	/**
	 * Gets an entity by id.
	 * @param {string} target The target entity.
	 * @param {string} alias The main table alias.
	 * @param {number} id The entity identifier.
	 * @param {queryBuilderFunc} queryBuilderFunc The optional query builder func.
	 */
	async getByIdAsync(target, alias, id, queryBuilderFunc) {
		const db = await UnitOfWorkFactory.createAsync();
		let queryBuilder = db.getRepository(target).createQueryBuilder(alias);

		if (queryBuilderFunc) queryBuilder = queryBuilderFunc(queryBuilder);

		return await queryBuilder
			.where(`${alias}.id = :id`, { id: id })
			.getOne();
	}

	/**
	 * The queryBuilder addon
	 *
	 * @callback queryBuilderFunc
	 * @param {SelectQueryBuilder} queryBuilderFunc.queryBuilder The optional query builder func.
	 */
	/**
	 * Deletes the entity by id.
	 * @param {string} target The target entity.
	 * @param {string} alias The main table alias.
	 * @param {number} id The entity identifier.
	 * @param {queryBuilderFunc} queryBuilderFunc The optional query builder func.
	 */
	async deleteAsync(target, alias, id, queryBuilderFunc) {
		const db = await UnitOfWorkFactory.createAsync();
		let queryBuilder = db.getRepository(target).createQueryBuilder(alias);

		if (queryBuilderFunc) queryBuilder = queryBuilderFunc(queryBuilder);

		return await queryBuilder
			.where(`${alias}.id = :id`, { id: id })
			.delete()
			.execute();
	}

	/**
	 * Deletes the ranges of entities.
	 * @param {string} target The target entity.
	 * @param {string} alias The main table alias.
	 * @param {queryBuilderFunc} queryBuilderFunc The optional query builder func.
	 */
	async deleteRangeAsync(target, alias, queryBuilderFunc) {
		const db = await UnitOfWorkFactory.createAsync();
		let queryBuilder = db.getRepository(target).createQueryBuilder(alias);

		if (queryBuilderFunc) queryBuilder = queryBuilderFunc(queryBuilder);

		return await queryBuilder
			.delete()
			.execute();
	}

	/**
	 * Deletes the ranges of entities.
	 * @param {string} target The target entity.
	 * @param {string} alias The main table alias.
	 * @param {queryBuilderFunc} queryBuilderFunc The optional query builder func.
	 */
	async updateRangeAsync(target, alias, queryBuilderFunc) {
		const db = await UnitOfWorkFactory.createAsync();
		let queryBuilder = db.getRepository(target).createQueryBuilder(alias);

		if (queryBuilderFunc) queryBuilder = queryBuilderFunc(queryBuilder);

		return await queryBuilder
			.update()
			.execute();
	}
}
