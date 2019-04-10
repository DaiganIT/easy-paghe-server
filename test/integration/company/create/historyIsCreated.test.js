import 'babel-polyfill';
import { expect } from 'chai';
import MockDate from 'mockdate';
import { History } from 'Entities/history';
import * as integrationSteps from '../../integration';
import * as companySteps from '../steps';
import createDb from '../../testUnitOfWork';

MockDate.set('2018-10-08T10:30:12');

const companyIn = {
  name: 'The name',
  fiscalCode: 'CRTPTR88B21F158K',
  ivaCode: '45612345655',
  inpsRegistrationNumber: '4561237892',
  inailRegistrationNumber: '4567891234',
  bases: [{
    name: 'Main Base',
    address: 'The main address'
  }, {
    name: 'Additional Base',
    address: 'The additional address',
  }]
}

const companyOut = {
  id: 1,
  customer: {
    id: 1,
    name: 'Test Customer'
  },
  name: 'The name',
  fiscalCode: 'CRTPTR88B21F158K',
  ivaCode: '45612345655',
  inpsRegistrationNumber: '4561237892',
  inailRegistrationNumber: '4567891234',
  bases: [
    {
      id: 1,
      customer: {
        id: 1,
        name: 'Test Customer'
      },
      name: 'Main Base',
      address: 'The main address',
      employees: undefined,
      company: undefined,
    },
    {
      id: 2,
      customer: {
        id: 1,
        name: 'Test Customer'
      },
      name: 'Additional Base',
      address: 'The additional address',
      employees: undefined,
      company: undefined,
    }
  ],
}

const expectedHistory = {
  id: 1,
  itemId: 1,
  entity: 'Company',
  type: 'Create',
  entityWasJson: '',
  entityIsJson: JSON.stringify(companyOut),
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
  before('WHEN I use the manager to create the company', async function () {
    await companySteps.whenICreateTheCompanyAsync(companyIn);
  });

  it('THEN the history is added', async function () {
    const db = await createDb();
    const histories = await db.getRepository(History).createQueryBuilder('history')
      .innerJoinAndSelect('history.customer', 'customer')
      .getMany();

    expect(histories).to.have.lengthOf(1);
    const addedHistory = histories[0];

    expect(addedHistory).to.deep.equal(expectedHistory);

    await db.close();
  });
});
