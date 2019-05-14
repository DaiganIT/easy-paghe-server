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
const person = { firstName: 'me', lastName: 'me', phone: '234' };

describe('GIVEN I have a company DTO', function () {
  let errors;
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
    await personSteps.whenICreateThePersonAsync(person);
  });
  before('WHEN I remove me', async () => {
    await companySteps.removeEmployeeAsync(1, err => errors = err);
  });

  it('THEN The person is not removed', async () => {
    expect(errors).to.equal('Questo persona non ha un lavoro');
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
  before('GIVEN I have a company in the database', async function () {
    await companySteps.whenICreateTheCompanyAsync(company);
  });
  before('GIVEN I have some persons in the database', async function () {
    await personSteps.whenICreateThePersonAsync(person);
  });
  before('WHEN I remove me', async () => {
    await companySteps.removeEmployeeAsync(10, err => errors = err);
  });

  it('THEN The person is not removed', async () => {
    expect(errors).to.equal('Impossibile trovare la persona');
  });
});