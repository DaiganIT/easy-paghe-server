import 'babel-polyfill';
import { expect } from 'chai';
import * as integrationSteps from '../../integration';
import * as companySteps from '../steps';

function createCompany(name) {
  return {
    name: name,
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
}

describe('can get list of company bases', function () {
  let dbCompanyBases;

  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have a company in the database', async function () {
    await companySteps.whenICreateTheCompanyAsync(createCompany('test'));
    await companySteps.whenICreateTheCompanyAsync(createCompany('test2'));
  });
  before('WHEN I use get bases list', async () => {
    dbCompanyBases = await companySteps.whenIGetBasesListAsync(1);
  });

  it('THEN list is returned', function () {
    expect(dbCompanyBases.items).to.have.lengthOf(2);
    expect(dbCompanyBases.length).to.equal(2);
  });
});
