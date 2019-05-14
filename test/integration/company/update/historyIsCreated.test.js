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

const companyUpdate = {
  id: 1,
  name: 'The name updated',
  fiscalCode: 'CRTPTR88B21F158S',
  ivaCode: '45612345654',
  inpsRegistrationNumber: '4561237893',
  inailRegistrationNumber: '4567891232',
  bases: [{
    id: 1,
    name: 'Main Base updated',
    address: 'The main address updated'
  }, {
    id: 2,
    name: 'Additional Base updated',
    address: 'The additional address updated',
  }, {
    name: 'Additional Base 3',
    address: 'The additional address 3',
  }]
}

const companyWas = {
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
      hirees: undefined,
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
      hirees: undefined,
      company: undefined,
    },
  ],
}

const companyOut = {
  id: 1,
  customer: {
    id: 1,
    name: 'Test Customer'
  },
  name: 'The name updated',
  fiscalCode: 'CRTPTR88B21F158S',
  ivaCode: '45612345654',
  inpsRegistrationNumber: '4561237893',
  inailRegistrationNumber: '4567891232',
  bases: [
    {
      id: 1,
      customer: {
        id: 1,
        name: 'Test Customer'
      },
      name: 'Main Base updated',
      address: 'The main address updated',
      hirees: undefined,
      company: undefined,
    },
    {
      id: 2,
      customer: {
        id: 1,
        name: 'Test Customer'
      },
      name: 'Additional Base updated',
      address: 'The additional address updated',
      hirees: undefined,
      company: undefined,
    },
    {
      id: 3,
      customer: {
        id: 1,
        name: 'Test Customer'
      },
      name: 'Additional Base 3',
      address: 'The additional address 3',
      hirees: undefined,
      company: undefined,
    }
  ],
}

const expectedHistory = {
  id: 2,
  itemId: 1,
  entity: 'Company',
  type: 'Update',
  entityWasJson: JSON.stringify(companyWas),
  entityIsJson: JSON.stringify(companyOut),
  date: new Date('2018-10-08T09:30:12.000Z'),
  customer: {
    id: 1,
    name: 'Test Customer'
  },
  user: 'Pietro'
}

describe.only('GIVEN I have a company DTO', function () {
  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have a company', async () => {
    await companySteps.whenICreateTheCompanyAsync(companyIn);
  });
  before('WHEN I update the company', async () => {
    await companySteps.whenIUpdateTheCompanyAsync(1, companyUpdate);
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
