import { History } from '../entities/history';
import { BaseCustomerManager } from './baseCustomerManager';
import moment from 'moment';

export class HistoryManager extends BaseCustomerManager {
	/**
	 * Creates a new {HistoryManager}.
	 * @param {Customer} customer The customer id.
	 */
	constructor(customer) {
		super(customer);
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
			entityIsJson: model.entityIsJson
		}));
		
		await super.saveAsync(History, histories);
		return histories;
	}
}
