import 'babel-polyfill';
import { expect } from 'chai';
import * as integrationSteps from '../../integration';
import * as companySteps from '../steps';
import * as personSteps from '../../people/steps';
import createDb from '../../testUnitOfWork';
import { Company } from 'entities/company';
import { Person } from 'entities/person';

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
const people = [
  { firstName: 'me', lastName: 'me' },
  { firstName: 'you', lastName: 'you' },
  { firstName: 'that guy', lastName: 'that guy' },
  { firstName: 'somebody else', lastName: 'somebody else' },
];

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
  before('GIVEN I have some persons in the database', async function () {
    for(const person of people)
      await personSteps.whenICreateThePersonAsync(person);
  });
  before('GIVEN I add me to the first base', async () => {
    await companySteps.addEmployeeAsync(1, 1);
    await companySteps.addEmployeeAsync(1, 3);
  });
  before('GIVEN I add you to the second base', async () => {
    await companySteps.addEmployeeAsync(2, 2);
  });
  before('WHEN I delete the company with the employees', async () => {
    await companySteps.whenIDeleteCompanyAsync(1, true);
  });

  it('THEN company is deleted', async function () {
    const db = await createDb();
    const companies = await db.getRepository(Company).find({ id: 1 });
    expect(companies).to.have.lengthOf(0);
    await db.close();
  });

  it('THEN persons are deleted', async function () {
    const db = await createDb();
    const person1 = await db.getRepository(Person).find({ id: 1 });
    const person2 = await db.getRepository(Person).find({ id: 2 });
    const person3 = await db.getRepository(Person).find({ id: 3 });
    expect(person1).to.have.lengthOf(0);
    expect(person2).to.have.lengthOf(0);
    expect(person3).to.have.lengthOf(0);
    await db.close();
  });
});

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
  before('GIVEN I have some persons in the database', async function () {
    for(const person of people)
      await personSteps.whenICreateThePersonAsync(person);
  });
  before('GIVEN I add me to the first base', async () => {
    await companySteps.addEmployeeAsync(1, 1);
    await companySteps.addEmployeeAsync(1, 3);
  });
  before('GIVEN I add you to the second base', async () => {
    await companySteps.addEmployeeAsync(2, 2);
  });
  before('WHEN I delete the company with the employees', async () => {
    await companySteps.whenIDeleteCompanyAsync(1, false);
  });

  it('THEN company is deleted', async function () {
    const db = await createDb();
    const companies = await db.getRepository(Company).find({ id: 1 });
    expect(companies).to.have.lengthOf(0);
    await db.close();
  });

  it('THEN persons are deleted', async function () {
    const db = await createDb();
    const person1 = await db.getRepository(Person).find({ id: 1 });
    const person2 = await db.getRepository(Person).find({ id: 2 });
    const person3 = await db.getRepository(Person).find({ id: 3 });
    expect(person1).to.have.lengthOf(1);
    expect(person2).to.have.lengthOf(1);
    expect(person3).to.have.lengthOf(1);

    expect(person1[0].companyBase).to.not.be.ok;
    expect(person2[0].companyBase).to.not.be.ok;
    expect(person3[0].companyBase).to.not.be.ok;

    await db.close();
  });
});