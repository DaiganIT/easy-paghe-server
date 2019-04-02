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

const companyByName = createCompany('by company name');
const companyByFiscalCode = createCompany('by fiscal code');
companyByFiscalCode.fiscalCode = 'CRTNTN88B21F158K';
const companyByIvaCode = createCompany('by iva code');
companyByIvaCode.ivaCode = 'ivacode4567';
const companyByINPS = createCompany('by inps');
companyByINPS.inpsRegistrationNumber = '7531597535';
const companyByINAIL = createCompany('by inail');
companyByINAIL.inailRegistrationNumber = '2648482659';
const companyByBaseName = createCompany('Base');
companyByBaseName.bases[0].name = 'home';
const companyByBaseAddress = createCompany('by base address');
companyByBaseAddress.bases[0].address = '35 inkerman';

const companies = [
  companyByName, companyByFiscalCode, companyByIvaCode, companyByINPS, companyByINAIL, companyByBaseName, companyByBaseAddress
];

const testCases = [
  {
    filter: 'company name',
    results: 1,
    companies: [companyByName],
  },
  {
    filter: 'NTN',
    results: 1,
    companies: [companyByFiscalCode],
  },
  {
    filter: 'ivacode',
    results: 1,
    companies: [companyByIvaCode],
  },
  {
    filter: '753',
    results: 1,
    companies: [companyByINPS],
  },
  {
    filter: '2648',
    results: 1,
    companies: [companyByINAIL],
  },
  {
    filter: 'home',
    results: 1,
    companies: [companyByBaseName],
  },
  {
    filter: 'inkerman',
    results: 1,
    companies: [companyByBaseAddress],
  },
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
      dbCompanies = await companySteps.whenIGetListAsync(testCase.filter);
    });

    it('THEN list is returned', function () {
      expect(dbCompanies.length).to.equal(testCase.results);
      expect(dbCompanies.items).to.have.lengthOf(testCase.results);

      let index = 0;
      for(const testResults of testCase.companies) {
        const realResult = dbCompanies.items[index];

        expect(realResult.name).to.equal(testResults.name);
        expect(realResult.fiscalCode).to.equal(testResults.fiscalCode);
        expect(realResult.ivaCode).to.equal(testResults.ivaCode);
        expect(realResult.inpsRegistrationNumber).to.equal(testResults.inpsRegistrationNumber);
        expect(realResult.inailRegistrationNumber).to.equal(testResults.inailRegistrationNumber);
        expect(realResult.bases[0].name).to.equal(testResults.bases[0].name);
        expect(realResult.bases[0].address).to.equal(testResults.bases[0].address);
      }
    });
  });
});
