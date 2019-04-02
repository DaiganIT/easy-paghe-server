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

const testCases = [
  {
    page: 1,
    limit: 5,
    firstItemName: '0',
    lastItemName: '4'
  },
  {
    page: 4,
    limit: 3,
    firstItemName: '9',
    lastItemName: '11'
  },
  {
    page: 10,
    limit: 5
  }
];

describe('GIVEN I have a company DTO', function () {
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

  testCases.forEach(testCase => {
    let dbCompanies;

    before('WHEN I use get list', async () => {
      dbCompanies = await companySteps.whenIGetListAsync('', testCase.page, testCase.limit);
    });

    it('THEN list is returned', function () {
      expect(dbCompanies.length).to.equal(25);

      if (testCase.page * testCase.limit > 25) {
        expect(dbCompanies.items).to.have.lengthOf(0);
      } else {
        expect(dbCompanies.items).to.have.lengthOf(testCase.limit);
      }

      if (dbCompanies.items.length > 0) {
        const firstCompany = dbCompanies.items[0];
        const lastCompany = dbCompanies.items[dbCompanies.items.length - 1];
        expect(firstCompany.name).to.equal(testCase.firstItemName);
        expect(lastCompany.name).to.equal(testCase.lastItemName);
      }
    });
  });
});
