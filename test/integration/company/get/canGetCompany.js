import 'babel-polyfill';
import { expect } from 'chai';
import * as integrationSteps from '../../integration';
import * as companySteps from '../steps';
import * as personSteps from '../../people/steps';

const companyToAdd = {
  name: 'Company name',
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
};
const people = [
  { name: 'me' },
  { name: 'you' },
  { name: 'that guy' },
];

describe('GIVEN I have a company DTO', function () {
  let company;

  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have some companies in the database', async function () {
    await companySteps.whenICreateTheCompanyAsync(companyToAdd);
  });
  before('GIVEN I have some persons in the database', async function () {
    for (const person of people)
      await personSteps.whenICreateThePersonAsync(person);
  });
  before('GIVEN I add some people to the company as employees', async () => {
    await companySteps.addEmployeeAsync(1, 1);
    await companySteps.addEmployeeAsync(1, 2);
    await companySteps.addEmployeeAsync(2, 3);
  });
  before('WHEN I use get a company', async () => {
    company = await companySteps.whenIGetCompanyAsync(1);
  });

  it('THEN Company is returned', function () {
    expect(company.id).to.equal(1);
    expect(company.name).to.equal('Company name');
    expect(company.fiscalCode).to.equal('CRTPTR88B21F158K');
    expect(company.ivaCode).to.equal('45612345655');
    expect(company.inpsRegistrationNumber).to.equal('4561237892');
    expect(company.inailRegistrationNumber).to.equal('4567891234');
    expect(company.bases).to.have.lengthOf(2);
    expect(company.bases[0].name).to.equal('Main Base');
    expect(company.bases[0].address).to.equal('The main address');
    expect(company.bases[1].name).to.equal('Additional Base');
    expect(company.bases[1].address).to.equal('The additional address');
    expect(company.bases[0].employees).to.not.be.ok;
    expect(company.bases[1].employees).to.not.be.ok;
  });
});

describe('GIVEN I have a company DTO', function () {
  let company;

  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have some companies in the database', async function () {
    await companySteps.whenICreateTheCompanyAsync(companyToAdd);
  });
  before('GIVEN I have some persons in the database', async function () {
    for (const person of people)
      await personSteps.whenICreateThePersonAsync(person);
  });
  before('GIVEN I add some people to the company as employees', async () => {
    await companySteps.addEmployeeAsync(1, 1);
    await companySteps.addEmployeeAsync(1, 2);
    await companySteps.addEmployeeAsync(2, 3);
  });
  before('WHEN I use get a company', async () => {
    company = await companySteps.whenIGetCompanyAsync(1, true);
  });

  it('THEN Company is returned', function () {
    expect(company.id).to.equal(1);
    expect(company.name).to.equal('Company name');
    expect(company.fiscalCode).to.equal('CRTPTR88B21F158K');
    expect(company.ivaCode).to.equal('45612345655');
    expect(company.inpsRegistrationNumber).to.equal('4561237892');
    expect(company.inailRegistrationNumber).to.equal('4567891234');
    expect(company.bases).to.have.lengthOf(2);
    expect(company.bases[0].name).to.equal('Main Base');
    expect(company.bases[0].address).to.equal('The main address');
    expect(company.bases[1].name).to.equal('Additional Base');
    expect(company.bases[1].address).to.equal('The additional address');
    expect(company.bases[0].employees).to.have.lengthOf(2)
    expect(company.bases[1].employees).to.have.lengthOf(1)
  });
});