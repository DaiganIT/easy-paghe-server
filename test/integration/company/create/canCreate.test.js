import 'babel-polyfill';
import { expect } from 'chai';
import { Company } from 'Entities/company';
import { steps } from '../../integration';
import * as companySteps from './steps';
import createDb from '../../testUnitOfWork';

const createTestCase = (name, companyIn, companyOut) => {
  const baseOut = {
    id: 1,
    name: null,
    fiscalCode: null,
    ivaCode: null,
    inpsRegistrationNumber: null,
    inailRegistrationNumber: null,
    bases: [],
    customer: {
      id: 1,
      name: 'Test Customer'
    }
  }
  const out = Object.assign({}, baseOut, companyOut);
  out.bases = out.bases.map((b,index) => ({
    id: index+1,
    name: b.name,
    address: b.address,
    employees: undefined,
    company: undefined,
    customer: {
      id: 1,
      name: 'Test Customer'
    }
  }));

  return {
    testName: name,
    in: companyIn,
    out: out
  }
}

const testCases = [
  createTestCase('Can create a company with only the name',
    {
      name: 'Test company'
    },
    {
      name: 'Test company',
    }),
  createTestCase('Can create a company with Fiscal Code',
    {
      name: 'Test company',
      fiscalCode: 'CRTPTR88B21F158K'
    },
    {
      name: 'Test company',
      fiscalCode: 'CRTPTR88B21F158K'
    }),
  createTestCase('Can create a company with IVA Code',
    {
      name: 'Test company',
      ivaCode: 'A'.repeat(11)
    },
    {
      name: 'Test company',
      ivaCode: 'A'.repeat(11)
    }),
  createTestCase('Can create a company with INPS Code',
    {
      name: 'Test company',
      inpsRegistrationNumber: '1'.repeat(10)
    },
    {
      name: 'Test company',
      inpsRegistrationNumber: '1'.repeat(10)
    }),
  createTestCase('Can create a company with INAIL Code',
    {
      name: 'Test company',
      inailRegistrationNumber: '1'.repeat(10)
    },
    {
      name: 'Test company',
      inailRegistrationNumber: '1'.repeat(10)
    }),
  createTestCase('Can create a company with 1 base',
    {
      name: 'Test company',
      bases: [{
        name: 'Main Base',
        address: 'The main address'
      }]
    },
    {
      name: 'Test company',
      bases: [{
        name: 'Main Base',
        address: 'The main address'
      }]
    }),
  createTestCase('Can create a company with 2 bases',
    {
      name: 'Test company',
      bases: [{
        name: 'Main Base',
        address: 'The main address'
      }, {
        name: 'Additional Base',
        address: 'The additional address',
      }]
    },
    {
      name: 'Test company',
      bases: [{
        name: 'Main Base',
        address: 'The main address'
      }, {
        name: 'Additional Base',
        address: 'The additional address',
      }]
    }),
];

testCases.forEach(function (testCase) {
  describe(testCase.testName, function () {
    steps.beforeGivenIHaveADatabase();
    steps.beforeGivenIHaveACustomer();
    
    before('WHEN I use the manager to create the company', async function () {
      await companySteps.whenICreateTheCompanyAsync(testCase.in);
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
      expect(addedCompany).to.deep.equal(testCase.out);

      await db.close();
    });
  });
});
