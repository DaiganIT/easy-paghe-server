import 'babel-polyfill';
import { expect } from 'chai';
import * as integrationSteps from '../../integration';
import * as historySteps from '../steps';

const createCompanyHistory = {
  itemId: 1,
  entity: 'Company',
  type: 'Create',
  entityWasJson: '',
  entityIsJson: ''
}

const createPersonHistory = {
  itemId: 1,
  entity: 'Person',
  type: 'Create',
  entityWasJson: '',
  entityIsJson: ''
}

const updateCompanyHistory = {
  itemId: 1,
  entity: 'Company',
  type: 'Update',
  entityWasJson: '',
  entityIsJson: ''
}

const updatePersonHistory = {
  itemId: 1,
  entity: 'Person',
  type: 'Update',
  entityWasJson: '',
  entityIsJson: ''
}

describe('GIVEN I have a history DTO', function () {
  let dbHistories;

  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have some histories in the database', async function () {
    await historySteps.whenICreateTheHistoryAsync(createPersonHistory);
    await historySteps.whenICreateTheHistoryAsync(createCompanyHistory);
    await historySteps.whenICreateTheHistoryAsync(updatePersonHistory);
    await historySteps.whenICreateTheHistoryAsync(updateCompanyHistory);
  });
  before('WHEN I use get list', async () => {
    dbHistories = await historySteps.whenIGetListAsync('Company', 1);
  });

  it('THEN list is returned', function () {
    expect(dbHistories.items).to.have.lengthOf(1);
    expect(dbHistories.length).to.equal(1);
    const oneHistory = dbHistories.items[0];

    expect(oneHistory.itemId).to.equal(1);
    expect(oneHistory.type).to.equal('Update');
    expect(oneHistory.entity).to.equal('Company');
  });
});
