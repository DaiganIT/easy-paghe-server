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
const person = { name: 'me', phone: '234' };

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
    await personSteps.whenICreateThePersonAsync(person);
  });
  before('GIVEN I add me to the first base', async () => {
    await companySteps.addEmployeeAsync(1, 1);
  });
  before('WHEN I remove me', async () => {
    await companySteps.removeEmployeeAsync(1);
  });

  it('THEN The person is removed', async () => {
    const db = await createDb();
    const employee = await db.getRepository(Person)
      .createQueryBuilder('person')
      .leftJoinAndSelect('person.companyBase', 'companyBase')
      .getOne();

    expect(employee).to.be.ok;
    expect(employee.companyBase).to.not.be.ok;
    await db.close();
  });
});