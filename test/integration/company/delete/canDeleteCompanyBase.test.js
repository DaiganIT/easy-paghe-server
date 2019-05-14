import 'babel-polyfill';
import { expect } from 'chai';
import * as integrationSteps from '../../integration';
import * as companySteps from '../steps';
import createDb from '../../testUnitOfWork';
import { Company } from 'entities/company';

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
  before('WHEN I delete the company with the employees', async () => {
    await companySteps.whenIDeleteCompanyBaseAsync(1, true);
  });

  it('THEN company is not deleted', async function () {
    const db = await createDb();
    const companies = await db.getRepository(Company).find({ where: { id: 1 }, relations: ['bases'] });
    expect(companies).to.have.lengthOf(1);
    expect(companies[0].bases).to.have.lengthOf(1);
    await db.close();
  });
});