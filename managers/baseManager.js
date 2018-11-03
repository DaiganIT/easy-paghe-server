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
	 * Gets an entity by id.
	 * @param {string} target The target entity.
	 * @param {number} id The entity identifier.
	 * @param {any} additional An additional search object.
	 */
	async getByIdAsync(target, id, additional = {}) {
		const db = await UnitOfWorkFactory.createAsync();
		try {
			const searchObject = Object.assign({}, {id: id}, additional);
			return await db.getRepository(target).findOne(searchObject);
		} finally {
			await db.close();
		}
	}

	/**
	 * Deletes the entity by id.
	 * @param {string} target The target entity.
	 * @param {number} id The user id.
	 * @param {any} additional An additional search object.
	 */
	async deleteAsync(target, id, additional = {}) {
		const db = await UnitOfWorkFactory.createAsync();
		try {
			const searchObject = Object.assign({}, {id: id}, additional);
			await db.getRepository(target).delete(searchObject);
		} finally {
			await db.close();
		}
	}
}
