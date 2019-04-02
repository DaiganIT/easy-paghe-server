import 'babel-polyfill';
import { expect } from 'chai';
import { Company } from 'Entities/company';
import * as integrationSteps from '../../integration';
import * as companySteps from './steps';
import createDb from '../../testUnitOfWork';

const companyIn = {
  name: 'The name',
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
}

const companyOut = {
  id: 1,
  name: 'The name',
  fiscalCode: 'CRTPTR88B21F158K',
  ivaCode: '45612345655',
  inpsRegistrationNumber: '4561237892',
  inailRegistrationNumber: '4567891234',
  bases: [
    {
      id: 1,
      name: 'Main Base',
      address: 'The main address',
      employees: undefined,
      company: undefined,
      customer: {
        id: 1,
        name: 'Test Customer'
      }
    },
    {
      id: 2,
      name: 'Additional Base',
      address: 'The additional address',
      employees: undefined,
      company: undefined,
      customer: {
        id: 1,
        name: 'Test Customer'
      }
    }
  ],
  customer: {
    id: 1,
    name: 'Test Customer'
  }
}

describe('GIVEN I have a company DTO', function () {
  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('WHEN I use the manager to create the company', async function () {
    await companySteps.whenICreateTheCompanyAsync(companyIn);
  });

  it('THEN the company is added', async function () {
    const db = await createDb();
    const companies = await db.getRepository(Company).createQueryBuilder('company')
      .leftJoinAndSelect('company.bases', 'bases')
      .innerJoinAndSelect('company.customer', 'customer')
      .leftJoinAndSelect('bases.customer', 'baseCustomer')
      .getMany();

    expect(companies).to.have.lengthOf(1);
    const addedCompany = companies[0];
    expect(addedCompany).to.deep.equal(companyOut);

    await db.close();
  });
});
