import 'babel-polyfill';
import { expect } from 'chai';
import { Company } from 'Entities/company';
import * as integrationSteps from '../../integration';
import * as companySteps from '../steps';
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

const companyUpdate = {
  id: 1,
  name: 'The name updated',
  fiscalCode: 'CRTPTR88B21F158S',
  ivaCode: '45612345654',
  inpsRegistrationNumber: '4561237893',
  inailRegistrationNumber: '4567891232',
  bases: [{
    id: 1,
    name: 'Main Base updated',
    address: 'The main address updated'
  }, {
    id: 2,
    name: 'Additional Base updated',
    address: 'The additional address updated',
  },{
    name: 'Third base',
    address: 'The third address',
  }]
}

const companyOut = {
  id: 1,
  name: 'The name updated',
  fiscalCode: 'CRTPTR88B21F158S',
  ivaCode: '45612345654',
  inpsRegistrationNumber: '4561237893',
  inailRegistrationNumber: '4567891232',
  bases: [
    {
      id: 1,
      name: 'Main Base updated',
      address: 'The main address updated',
      hirees: undefined,
      company: undefined,
      customer: {
        id: 1,
        name: 'Test Customer'
      }
    },
    {
      id: 2,
      name: 'Additional Base updated',
      address: 'The additional address updated',
      hirees: undefined,
      company: undefined,
      customer: {
        id: 1,
        name: 'Test Customer'
      }
    },
    {
      id: 3,
      name: 'Third base',
      address: 'The third address',
      hirees: undefined,
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
  before('GIVEN I have a company', async () => {
    await companySteps.whenICreateTheCompanyAsync(companyIn);
  });
  before('WHEN I update the company', async () => {
    await companySteps.whenIUpdateTheCompanyAsync(1, companyUpdate);
  });

  it('THEN the company is updated', async function () {
    const db = await createDb();
    const companies = await db.getRepository(Company).createQueryBuilder('company')
      .leftJoinAndSelect('company.bases', 'bases')
      .innerJoinAndSelect('company.customer', 'customer')
      .leftJoinAndSelect('bases.customer', 'baseCustomer')
      .getMany();

    expect(companies).to.have.lengthOf(1);
    const updatedCompany = companies[0];
    expect(updatedCompany).to.deep.equal(companyOut);

    await db.close();
  });
});
