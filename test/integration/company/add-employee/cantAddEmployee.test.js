import 'babel-polyfill';
import { expect } from 'chai';

import { Person } from 'entities/person';

import * as integrationSteps from '../../integration';
import * as companySteps from '../steps';
import * as personSteps from '../../people/steps';
import createDb from '../../testUnitOfWork';

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
const secondCompany = {
  name: 'Company name 2',
  bases: [{
    name: 'Main Base',
    address: 'The main address'
  }, {
    name: 'Additional Base',
    address: 'The additional address',
  }]
}
const employeedPerson = { name: 'me', phone: '234' };

describe('GIVEN I have a company DTO', function () {
  let errors;
  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have two companies in the database', async function () {
    await companySteps.whenICreateTheCompanyAsync(company);
    await companySteps.whenICreateTheCompanyAsync(secondCompany);
  });
  before('GIVEN I have some persons in the database', async function () {
    await personSteps.whenICreateThePersonAsync(employeedPerson);
  });
  before('GIVEN I add the employeed person to the first company', async () => {
    await companySteps.addEmployeeAsync(1, 1);
  });
  before('WHEN I add the employeed person to the second copmany', async () => {
    await companySteps.addEmployeeAsync(3, 1, (err) => errors = err);
  });

  it('THEN The person is not added', async () => {
    expect(errors).to.equal('Questo persona ha gia un altro lavoro');
  });
});

describe('GIVEN I have a company DTO', function () {
  let errors;
  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have two companies in the database', async function () {
    await companySteps.whenICreateTheCompanyAsync(company);
    await companySteps.whenICreateTheCompanyAsync(secondCompany);
  });
  before('GIVEN I have some persons in the database', async function () {
    await personSteps.whenICreateThePersonAsync(employeedPerson);
  });
  before('WHEN I add the employeed person to the second copmany', async () => {
    await companySteps.addEmployeeAsync(2, 3, (err) => errors = err);
  });

  it('THEN The person is not added', async () => {
    expect(errors).to.equal('Impossibile trovare la persona');
  });
});

describe('GIVEN I have a company DTO', function () {
  let errors;
  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have two companies in the database', async function () {
    await companySteps.whenICreateTheCompanyAsync(company);
    await companySteps.whenICreateTheCompanyAsync(secondCompany);
  });
  before('GIVEN I have some persons in the database', async function () {
    await personSteps.whenICreateThePersonAsync(employeedPerson);
  });
  before('WHEN I add the employeed person to the second copmany', async () => {
    await companySteps.addEmployeeAsync(10, 1, (err) => errors = err);
  });

  it('THEN The person is not added', async () => {
    expect(errors).to.equal('Impossibile trovare la sede dell\'azienda');
  });
});
