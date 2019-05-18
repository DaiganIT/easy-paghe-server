import 'babel-polyfill';
import { expect } from 'chai';
import * as integrationSteps from '../../integration';
import * as companySteps from '../steps';

const baseByName = {
  name: 'florida',
  address: 'via delle palme'
};
const baseByAddress = {
  name: 'california',
  address: 'via del sole',
}

function createCompany(name) {
  return {
    name: name,
    fiscalCode: 'CRTPTR88B21F158K',
    ivaCode: '45612345655',
    inpsRegistrationNumber: '4561237892',
    inailRegistrationNumber: '4567891234',
    bases: [baseByName, baseByAddress]
  }
}

const testCases = [
  {
    filter: 'florida',
    results: 1,
    bases: [baseByName],
  },
  {
    filter: 'sole',
    results: 1,
    bases: [baseByAddress],
  },
];

describe.only('can get list of company bases filtered', function () {
  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have some companies in the database', async function () {
    await companySteps.whenICreateTheCompanyAsync(createCompany('test'));
    await companySteps.whenICreateTheCompanyAsync(createCompany('test2'));
  });

  testCases.forEach(testCase => {
    let dbCompanyBases;

    before('WHEN I use get list', async () => {
      dbCompanyBases = await companySteps.whenIGetBasesListAsync(1, testCase.filter);
    });

    it('THEN list is returned', function () {
      expect(dbCompanyBases.length).to.equal(testCase.results);
      expect(dbCompanyBases.items).to.have.lengthOf(testCase.results);

      let index = 0;
      for (const testResults of testCase.bases) {
        const realResult = dbCompanyBases.items[index];

        expect(realResult.name).to.equal(testResults.name);
        expect(realResult.address).to.equal(testResults.address);
      }
    });
  });
});
