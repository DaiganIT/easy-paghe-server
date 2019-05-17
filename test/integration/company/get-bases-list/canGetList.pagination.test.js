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
    }, {
      name: 'Additional Base 3',
      address: 'The additional address',
    }, {
      name: 'Additional Base 10',
      address: 'The additional address',
    }, {
      name: 'Additional Base 25',
      address: 'The additional address',
    }]
  }
}

const testCases = [
  {
    page: 1,
    limit: 2,
    expectedLength: 2,
    firstItemName: 'Main Base',
    lastItemName: 'Additional Base'
  },
  {
    page: 2,
    limit: 3,
    expectedLength: 2,
    firstItemName: 'Additional Base 10',
    lastItemName: 'Additional Base 25'
  },
  {
    page: 10,
    limit: 5
  }
];

describe('can get list of company bases paginated', function () {
  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have some companies in the database', async function () {
    await companySteps.whenICreateTheCompanyAsync(createCompany('test'));
  });

  testCases.forEach(testCase => {
    let dbCompanyBases;

    before('WHEN I use get list', async () => {
      dbCompanyBases = await companySteps.whenIGetBasesListAsync(1, '', testCase.page, testCase.limit);
    });

    it('THEN list is returned', function () {
      expect(dbCompanyBases.length).to.equal(5);

      if ((testCase.page-1) * testCase.limit > 5) {
        expect(dbCompanyBases.items).to.have.lengthOf(0);
      } else {
        expect(dbCompanyBases.items).to.have.lengthOf(testCase.expectedLength);
      }

      if (dbCompanyBases.items.length > 0) {
        const firstCompanyBase = dbCompanyBases.items[0];
        const lastCompanyBase = dbCompanyBases.items[dbCompanyBases.items.length - 1];
        expect(firstCompanyBase.name).to.equal(testCase.firstItemName);
        expect(lastCompanyBase.name).to.equal(testCase.lastItemName);
      }
    });
  });
});
