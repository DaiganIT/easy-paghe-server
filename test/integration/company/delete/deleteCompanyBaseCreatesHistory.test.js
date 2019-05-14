import 'babel-polyfill';
import { expect } from 'chai';
import MockDate from 'mockdate';
import * as integrationSteps from '../../integration';
import * as companySteps from '../steps';
import * as personSteps from '../../people/steps';
import createDb from '../../testUnitOfWork';
import { History } from 'entities/history';

MockDate.set('2018-10-08T10:30:12');

const company = {
  name: 'Company name',
  bases: [{
    name: 'Main Base',
    address: 'The main address'
  }, {
    name: 'Additional Base',
    address: 'The additional address',
  }]
}

const companyWas = {
  id: 1,
  customer: {
    id: 1,
    name: 'Test Customer'
  },
  name: 'Company name',
  fiscalCode: null,
  ivaCode: null,
  inpsRegistrationNumber: null,
  inailRegistrationNumber: null,
  bases: [
    {
      id: 1,
      customer: {
        id: 1,
        name: 'Test Customer'
      },
      name: 'Main Base',
      address: 'The main address',
      hirees: undefined,
    },
    {
      id: 2,
      customer: {
        id: 1,
        name: 'Test Customer'
      },
      name: 'Additional Base',
      address: 'The additional address',
      hirees: undefined,
    },
  ],
}

const companyIs = {
  id: 1,
  customer: {
    id: 1,
    name: 'Test Customer'
  },
  name: 'Company name',
  fiscalCode: null,
  ivaCode: null,
  inpsRegistrationNumber: null,
  inailRegistrationNumber: null,
  bases: [
    {
      id: 2,
      customer: {
        id: 1,
        name: 'Test Customer'
      },
      name: 'Additional Base',
      address: 'The additional address',
      hirees: undefined,
    }
  ],
}

const expectedHistory = {
  id: 2,
  itemId: 1,
  entity: 'Company',
  type: 'Update',
  entityWasJson: JSON.stringify(companyWas),
  entityIsJson: JSON.stringify(companyIs),
  date: new Date('2018-10-08T09:30:12.000Z'),
  customer: {
    id: 1,
    name: 'Test Customer'
  },
  user: 'Pietro'
}

describe('GIVEN I have a company DTO', function () {
  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have a company in the database', async function () {
    await companySteps.whenICreateTheCompanyAsync(company);
  });
  before('WHEN I delete the company with the employees', async () => {
    await companySteps.whenIDeleteCompanyBaseAsync(1, true);
  });

  it('THEN the history is added', async function () {
    const db = await createDb();
    const histories = await db.getRepository(History).createQueryBuilder('history')
      .innerJoinAndSelect('history.customer', 'customer')
      .getMany();

    expect(histories).to.have.lengthOf(2);
    const addedHistory = histories[1];

    expect(addedHistory).to.deep.equal(expectedHistory);

    await db.close();
  });
});
