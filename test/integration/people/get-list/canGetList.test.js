import 'babel-polyfill';
import { expect } from 'chai';
import * as integrationSteps from '../../integration';
import * as personSteps from '../steps';

function createPerson(name, surname) {
  return {
    firstName: name,
    lastName: surname,
    phone: '8645',
    email: 'pietro.carta88@gmail.com',
    address: '35 Inkerman Road'
  }
}

let index = 0;
const people = [];
for (const _ of Array(25)) {
  people.push(createPerson(`name ${index}`, `surname ${index}`));
  index++;
}

describe('GIVEN I have a person DTO', function () {
  let dbPeople;

  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have some people in the database', async function () {
    for (const person of people)
      await personSteps.whenICreateThePersonAsync(person);
  });
  before('WHEN I use get list', async () => {
    dbPeople = await personSteps.whenIGetListAsync();
  });

  it('THEN list is returned', function () {
    expect(dbPeople.items).to.have.lengthOf(10);
    expect(dbPeople.length).to.equal(25);
  });
});
