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

const testCases = [
  {
    page: 1,
    limit: 5,
    firstItemName: 'name 0',
    lastItemName: 'name 4'
  },
  {
    page: 4,
    limit: 3,
    firstItemName: 'name 9',
    lastItemName: 'name 11'
  },
  {
    page: 10,
    limit: 5
  }
];

describe('GIVEN I have a person DTO', function () {
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

  testCases.forEach(testCase => {
    let dbPeople;

    before('WHEN I use get list', async () => {
      dbPeople = await personSteps.whenIGetListAsync('', testCase.page, testCase.limit);
    });

    it('THEN list is returned', function () {
      expect(dbPeople.length).to.equal(25);

      if (testCase.page * testCase.limit > 25) {
        expect(dbPeople.items).to.have.lengthOf(0);
      } else {
        expect(dbPeople.items).to.have.lengthOf(testCase.limit);
      }

      if (dbPeople.items.length > 0) {
        const firstPerson = dbPeople.items[0];
        const lastPerson = dbPeople.items[dbPeople.items.length - 1];
        expect(firstPerson.firstName).to.equal(testCase.firstItemName);
        expect(lastPerson.firstName).to.equal(testCase.lastItemName);
      }
    });
  });
});
