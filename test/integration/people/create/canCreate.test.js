import 'babel-polyfill';
import MockDate from 'mockdate';
import { expect } from 'chai';
import { Person } from 'Entities/person';
import { History } from 'Entities/history';
import * as integrationSteps from '../../integration';
import * as personSteps from '../steps';
import createDb from '../../testUnitOfWork';

MockDate.set('2018-10-08T10:30:12');

const personIn = {
  firstName: 'Pietro',
  lastName: 'Carta',
  email: 'pietro.carta88@gmail.com',
  phone: '68546',
  address: '35 Inkerman Road'
}

const personOut = {
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
  hired: undefined,
}

const historyOut = {
  id: 1,
  itemId: 1,
  type: 'Create',
  entityWasJson: '',
  entityIsJson: JSON.stringify(personOut),
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
  before('WHEN I use the manager to create the person', async function () {
    await personSteps.whenICreateThePersonAsync(personIn);
  });

  it('THEN the person is added', async function () {
    const db = await createDb();
    const people = await db.getRepository(Person).createQueryBuilder('person')
      .innerJoinAndSelect('person.customer', 'customer')
      .getMany();

    expect(people).to.have.lengthOf(1);
    const addedPerson = people[0];
    expect(addedPerson).to.deep.equal(personOut);

    await db.close();
  });

  it('THEN the history is added', async function () {
    const db = await createDb();
    const histories = await db.getRepository(History).createQueryBuilder('history')
      .innerJoinAndSelect('history.customer', 'customer')
      .getMany();

    expect(histories).to.have.lengthOf(1);
    const addedHistory = histories[0];
    expect(addedHistory).to.deep.equal(historyOut);

    await db.close();
  });
});
