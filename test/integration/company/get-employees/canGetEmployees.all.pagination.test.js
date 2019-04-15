import 'babel-polyfill';
import { expect } from 'chai';
import * as integrationSteps from '../../integration';
import * as companySteps from '../steps';
import * as personSteps from '../../people/steps';

const company = {
  name: 'Company name',
  bases: [{
    name: 'Main Base',
    address: 'The main address'
  }, {
    name: 'Additional Base',
    address: 'The additional address',
  }]
}
const people = [
  { firstName: 'me name', lastName: 'me name', phone: '234' },
  { firstName: 'you', lastName: 'you', email: 'test@test.it' },
  { firstName: 'that guy', lastName: 'that guy', address: 'my home' },
  { firstName: 'somebody else', lastName: 'somebody else' },
  { firstName: '1', lastName: '1' },
  { firstName: '2', lastName: '2' },
  { firstName: '3', lastName: '3' },
  { firstName: '4', lastName: '4' },
  { firstName: '5', lastName: '5' },
];

const testCases = [
  {
    page: 1,
    limit: 5,
    firstItemName: 'me name',
    lastItemName: 'you'
  },
  {
    page: 3,
    limit: 3,
    firstItemName: '3',
    lastItemName: '5'
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
  before('GIVEN I have a company in the database', async function () {
    await companySteps.whenICreateTheCompanyAsync(company);
  });
  before('GIVEN I have some persons in the database', async function () {
    for (const person of people)
      await personSteps.whenICreateThePersonAsync(person);
  });
  before('GIVEN I add me to the first base', async () => {
    await companySteps.addEmployeeAsync(1, 1);
    await companySteps.addEmployeeAsync(1, 3);
    await companySteps.addEmployeeAsync(1, 4);
    await companySteps.addEmployeeAsync(1, 5);
    await companySteps.addEmployeeAsync(1, 6);
  });
  before('GIVEN I add you to the second base', async () => {
    await companySteps.addEmployeeAsync(2, 2);
    await companySteps.addEmployeeAsync(2, 7);
    await companySteps.addEmployeeAsync(2, 8);
    await companySteps.addEmployeeAsync(2, 9);
  });

  testCases.forEach(testCase => {
  let employees;
  before('WHEN I get the list of all employees', async () => {
      employees = await companySteps.whenIGetListOfAllEmployeesAsync(1, undefined, testCase.page, testCase.limit);
    });

    it('THEN list is returned', function () {
      expect(employees.length).to.equal(9);

      if (testCase.page * testCase.limit > 9) {
        expect(employees.items).to.have.lengthOf(0);
      } else {
        expect(employees.items).to.have.lengthOf(testCase.limit);
      }

      if (employees.items.length > 0) {
        const firstEmployee = employees.items[0];
        const lastEmployee = employees.items[employees.items.length - 1];
        expect(firstEmployee.firstName).to.equal(testCase.firstItemName);
        expect(lastEmployee.firstName).to.equal(testCase.lastItemName);
      }
    });
  });
});
