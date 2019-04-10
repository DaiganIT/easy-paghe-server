import { History, HistoryType } from '../entities/history';
import { BaseCustomerManager } from './baseCustomerManager';
import moment from 'moment';

export class HistoryManager extends BaseCustomerManager {
	/**
		 * Creates a new {HistoryManager}.
		 * @param {User} user The user.
		 */
	constructor(user) {
		super(user);
	}

	/**
	 * Creates new histories.
	 * @param {AddHistoryDto[]} models The histories create model.
	 */
	async addAsync(models) {
		const thisMoment = moment();
		const histories = models.map(model => ({
			date: thisMoment.format(),
			entity: model.entity,
			itemId: model.itemId,
			type: model.type,
			entityWasJson: model.entityWasJson,
			entityIsJson: model.entityIsJson,
			user: this.user.name
		}));

		await super.saveAsync(History, histories);
		return histories;
	}

	/**
	 * Gets a list of histories for the target entity.
	 * @param {string} entity The target entity.
	 * @param {number} itemId The entity id.
	 * @param {string} filter Text search string.
	 * @param {number} page Page number.
	 * @param {number} pageLimit Number of element per page.
	 */
	async getAsync(entity, itemId, filter, page, pageLimit) {
		return await super.getAsync(History, 'history', page, pageLimit, (queryBuilder) => {
			queryBuilder.where(
				`history.entity = :entity
					and history.type = :historyType
					and history.itemId = :itemId`,
				{ entity: entity, itemId: itemId, historyType: HistoryType.Update },
			);
			queryBuilder.orderBy('history.date', 'DESC');

			return queryBuilder;
		});
	}
}
