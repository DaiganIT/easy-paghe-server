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
	 */
	async getByIdAsync(target, id) {
		const db = await UnitOfWorkFactory.createAsync();
		try {
			return await db.getRepository(target).findOne(id);
		} finally {
			await db.close();
		}
	}

	/**
	 * Deletes the entity by id.
	 * @param {string} target The target entity.
	 * @param {number} id The user id.
	 */
	async deleteAsync(target, id) {
		const db = await UnitOfWorkFactory.createAsync();
		try {
			await db.getRepository(target).delete(id);
		} finally {
			await db.close();
		}
	}
}
