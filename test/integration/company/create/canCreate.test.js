import 'babel-polyfill';
import { expect } from 'chai';
import { CompanyManager } from 'Managers/companyManager';
import { Customer } from 'Entities/customer';
import { Company } from 'Entities/company';
import { steps } from '../../integration';
import createDb from '../../testUnitOfWork';

const testCases = [
  {
    testName: 'Can create a company with only the name',
    in: {
      name: 'Test company'
    },
    out: {
      id: 1,
      name: 'Test company',
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
  },
  {
    testName: 'Can create a company with Fiscal Code',
    in: {
      name: 'Test company',
      fiscalCode: 'CRTPTR88B21F158K'
    },
    out: {
      id: 1,
      name: 'Test company',
      fiscalCode: 'CRTPTR88B21F158K',
      ivaCode: null,
      inpsRegistrationNumber: null,
      inailRegistrationNumber: null,
      bases: [],
      customer: {
        id: 1,
        name: 'Test Customer'
      }
    }
  },
  {
    testName: 'Can create a company with the IVA code',
    in: {
      name: 'Test company',
      ivaCode: 'A'.repeat(11)
    },
    out: {
      id: 1,
      name: 'Test company',
      fiscalCode: null,
      ivaCode: 'A'.repeat(11),
      inpsRegistrationNumber: null,
      inailRegistrationNumber: null,
      bases: [],
      customer: {
        id: 1,
        name: 'Test Customer'
      }
    }
  },
  {
    testName: 'Can create a company with the INPS code',
    in: {
      name: 'Test company',
      inpsRegistrationNumber: '1'.repeat(10)
    },
    out: {
      id: 1,
      name: 'Test company',
      fiscalCode: null,
      ivaCode: null,
      inpsRegistrationNumber: '1'.repeat(10),
      inailRegistrationNumber: null,
      bases: [],
      customer: {
        id: 1,
        name: 'Test Customer'
      }
    }
  },
  {
    testName: 'Can create a company with the INAIL code',
    in: {
      name: 'Test company',
      inailRegistrationNumber: '1'.repeat(10)
    },
    out: {
      id: 1,
      name: 'Test company',
      fiscalCode: null,
      ivaCode: null,
      inpsRegistrationNumber: null,
      inailRegistrationNumber: '1'.repeat(10),
      bases: [],
      customer: {
        id: 1,
        name: 'Test Customer'
      }
    }
  },
  {
    testName: 'Can create a company with 1 base',
    in: {
      name: 'Test company',
      bases: [{
        name: 'Main Base',
        address: 'The main address'
      }]
    },
    out: {
      id: 1,
      name: 'Test company',
      fiscalCode: null,
      ivaCode: null,
      inpsRegistrationNumber: null,
      inailRegistrationNumber: null,
      bases: [{
        id: 1,
        name: 'Main Base',
        address: 'The main address',
        company: undefined,
        customer: {
          id: 1,
          name: 'Test Customer'
        },
        employees: undefined
      }],
      customer: {
        id: 1,
        name: 'Test Customer'
      }
    }
  },
  {
    testName: 'Can create a company with 2 bases',
    in: {
      name: 'Test company',
      bases: [{
        name: 'Main Base',
        address: 'The main address'
      }, {
        name: 'Additional Base',
        address: 'The additional address',
        company: undefined,
        customer: {
          id: 1,
          name: 'Test Customer'
        },
        employees: undefined
      }]
    },
    out: {
      id: 1,
      name: 'Test company',
      fiscalCode: null,
      ivaCode: null,
      inpsRegistrationNumber: null,
      inailRegistrationNumber: null,
      bases: [{
        id: 1,
        name: 'Main Base',
        address: 'The main address',
        company: undefined,
        customer: {
          id: 1,
          name: 'Test Customer'
        },
        employees: undefined
      }, {
        id: 2,
        name: 'Additional Base',
        address: 'The additional address',
        company: undefined,
        customer: {
          id: 1,
          name: 'Test Customer'
        },
        employees: undefined
      }],
      customer: {
        id: 1,
        name: 'Test Customer'
      }
    }
  }
];

testCases.forEach(function (testCase) {
  describe(testCase.testName, function () {
    steps.givenIHaveADatabase();
    steps.givenIHaveACustomer();
  
    before('WHEN I use the manager to create the company', async function () {
      const db = await createDb();
      const testCustomer = (await db.getRepository(Customer).find())[0];
      const companyManager = new CompanyManager(testCustomer);
  
      await companyManager.addAsync(testCase.in);
      await db.close();
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
