import { UnitOfWorkFactory } from '../database/unitOfWorkFactory';

export class BaseManager {
	/**
	 * Saves the entity.
	 * @param {string} target The target entity.
	 * @param {any} entity The entity to save.
	 */
	async saveAsync(target, entity) {
		const db = await UnitOfWorkFactory.createAsync();
		try {
			await db.getRepository(target).save(entity);
		} finally {
			await db.close();
		}
	}

	/**
	 * Gets a list of entities
	 * @param {string} target The target entity.
	 * @param {string} alias The main table alias.
	 * @param {number} page The page number.
	 * @param {number} pageLimit The page limit.
	 * @param {function} queryBuilderFunc The optional query builder func.
	 */
	async getAsync(target, alias, page, pageLimit, queryBuilderFunc) {
		const db = await UnitOfWorkFactory.createAsync();
		try {
			let queryBuilder = db.getRepository(target)
				.createQueryBuilder(alias)

			if(queryBuilderFunc)
				queryBuilder = queryBuilderFunc(queryBuilder);

			return await queryBuilder
				.skip((page - 1) * pageLimit)
				.take(pageLimit)
				.getMany();
		} finally {
			await db.close();
		}
	}

	/**
	 * Gets an entity by id.
	 * @param {string} target The target entity.
	 * @param {string} alias The main table alias.
	 * @param {number} id The entity identifier.
	 * @param {function} queryBuilderFunc The optional query builder func.
	 */
	async getByIdAsync(target, alias, id, queryBuilderFunc) {
		const db = await UnitOfWorkFactory.createAsync();
		try {
			let queryBuilder = db.getRepository(target)
				.createQueryBuilder(alias)

			if(queryBuilderFunc)
				queryBuilder = queryBuilderFunc(queryBuilder);

			return await queryBuilder
				.where(`${alias}.id = :id`, { id: id })
				.getOne();
		} finally {
			await db.close();
		}
	}

	/**
	 * Deletes the entity by id.
	 * @param {string} target The target entity.
	 * @param {string} alias The main table alias.
	 * @param {number} id The entity identifier.
	 * @param {function} queryBuilderFunc The optional query builder func.
	 */
	async deleteAsync(target, alias, id, queryBuilderFunc) {
		const db = await UnitOfWorkFactory.createAsync();
		try {
			let queryBuilder = db.getRepository(target)
				.createQueryBuilder(alias)

			if(queryBuilderFunc)
				queryBuilder = queryBuilderFunc(queryBuilder);

			return await queryBuilder
				.where(`${alias}.id = :id`, { id: id })
				.delete().execute();
		} finally {
			await db.close();
		}
	}
}
