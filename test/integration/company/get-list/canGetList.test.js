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

let index = 0;
const companies = [];
for (const _ of Array(25)) {
  companies.push(createCompany(`${index}`));
  index++;
}

describe('GIVEN I have a company DTO', function () {
  let dbCompanies;

  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have some companies in the database', async function () {
    for (const company of companies)
      await companySteps.whenICreateTheCompanyAsync(company);
  });
  before('WHEN I use get list', async () => {
    dbCompanies = await companySteps.whenIGetListAsync();
  });

  it('THEN list is returned', function () {
    expect(dbCompanies.items).to.have.lengthOf(10);
    expect(dbCompanies.length).to.equal(25);
    const oneCompany = dbCompanies.items[0];
    expect(oneCompany.bases).to.be.an('array');
    expect(oneCompany.bases).to.have.lengthOf(2);
  });
});
