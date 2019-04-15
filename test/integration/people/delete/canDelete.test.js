import 'babel-polyfill';
import MockDate from 'mockdate';
import { expect } from 'chai';
import * as integrationSteps from '../../integration';
import * as personSteps from '../steps';
import createDb from '../../testUnitOfWork';
import { Person } from 'entities/person';
import { History } from 'entities/history';

MockDate.set('2018-10-08T10:30:12');

const personToAdd = {
  firstName: 'Pietro',
  lastName: 'Carta',
  email: 'pietro.carta88@gmail.com',
  phone: '68546',
  address: '35 Inkerman Road'
};

const personWas = {
  id: 1,
  customer: {
    id: 1,
    name: 'Test Customer'
  },
  firstName: 'Pietro',
  lastName: 'Carta',
  phone: '68546',
  address: '35 Inkerman Road',
  email: 'pietro.carta88@gmail.com',
  companyBase: null,
}

const historyOut = {
  id: 2,
  itemId: 1,
  type: 'Delete',
  entityWasJson: JSON.stringify(personWas),
  entityIsJson: '',
  entity: 'Person',
  user: 'Pietro',
  date: new Date('2018-10-08T09:30:12.000Z'),
  customer: {
    id: 1,
    name: 'Test Customer'
  },
}

describe('GIVEN I have a person DTO', function () {
  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have a person in the database', async function () {
    await personSteps.whenICreateThePersonAsync(personToAdd);
  });
  before('WHEN I delete the person', async () => {
    await personSteps.whenIDeleteThePersonAsync(1);
  });

  it('THEN person is deleted', async function () {
    const db = await createDb();
    const people = await db.getRepository(Person).find({ id: 1 });
    expect(people).to.have.lengthOf(0);
    await db.close();
  });

  it('THEN the history is added', async function () {
    const db = await createDb();
    const histories = await db.getRepository(History).createQueryBuilder('history')
      .innerJoinAndSelect('history.customer', 'customer')
      .getMany();

    expect(histories).to.have.lengthOf(2);
    const addedHistory = histories[1];
    expect(addedHistory).to.deep.equal(historyOut);

    await db.close();
  });
});
