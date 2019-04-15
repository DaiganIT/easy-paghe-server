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

const personByFirstName = createPerson('by person name', 'last name');
const personByLastName = createPerson('pietro', 'rcarta');
const personByPhone = createPerson('by fiscal code', 'last name');
personByPhone.phone = '6546';
const personByAddress = createPerson('by address', 'last name');
personByAddress.address = 'guildford road';
const personByEmail = createPerson('by email', 'last name');
personByEmail.email = 'test@email.com';

const people = [
  personByFirstName, personByLastName, personByPhone, personByAddress, personByEmail
];

const testCases = [
  {
    filter: 'person name',
    results: 1,
    people: [personByFirstName],
  },
  {
    filter: 'rcarta',
    results: 1,
    people: [personByLastName],
  },
  {
    filter: '6546',
    results: 1,
    people: [personByPhone],
  },
  {
    filter: 'guildford',
    results: 1,
    people: [personByAddress],
  },
  {
    filter: 'email',
    results: 1,
    people: [personByEmail],
  },
];

describe.only('GIVEN I have a person DTO', function () {
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
      dbPeople = await personSteps.whenIGetListAsync(testCase.filter);
    });

    it('THEN list is returned', function () {
      expect(dbPeople.length).to.equal(testCase.results);
      expect(dbPeople.items).to.have.lengthOf(testCase.results);

      let index = 0;
      for(const testResults of testCase.people) {
        const realResult = dbPeople.items[index];

        expect(realResult.firstName).to.equal(testResults.firstName);
        expect(realResult.lastName).to.equal(testResults.lastName);
        expect(realResult.phone).to.equal(testResults.phone);
        expect(realResult.address).to.equal(testResults.address);
        expect(realResult.email).to.equal(testResults.email);
      }
    });
  });
});
