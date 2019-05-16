import 'babel-polyfill';
import { expect } from 'chai';
import * as integrationSteps from '../../integration';
import * as companySteps from '../../company/steps';
import * as personSteps from '../../people/steps';
import * as hireSteps from '../steps';

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
const people = [
  { firstName: 'me name', lastName: 'me name', phone: '234' },
  { firstName: 'you', lastName: 'you', email: 'test@test.it' },
];

describe.only('GIVEN I have a company DTO', function () {
  let dbHired;

  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have basic data', async function () {
    await integrationSteps.givenIHaveBasicDataAsync();
  });
  before('GIVEN I have a company in the database', async function () {
    await companySteps.whenICreateTheCompanyAsync(companyIn);
  });
  before('GIVEN I have some people in the database', async function () {
    for (const person of people)
      await personSteps.whenICreateThePersonAsync(person);
  });
  before('GIVEN The company hires the two people', async () => {
    await hireSteps.whenTheCompanyHiresAPerson({
      startDate: '2015-01-01',
      endDate: '2016-01-01',
      holidays: 20,
      weekHours: 30,
      companyBaseId: 1,
      personId: 1,
      ccnlId: 1,
      salaryTableId: 1
    });

    await hireSteps.whenTheCompanyHiresAPerson({
      startDate: '2016-01-01',
      endDate: '2017-01-01',
      holidays: 25,
      weekHours: 35,
      companyBaseId: 1,
      personId: 2,
      ccnlId: 1,
      salaryTableId: 2
    });
  });
  before('WHEN I use get list', async () => {
    dbHired = await hireSteps.whenIGetListAsync();
  });

  it('THEN list is returned', function () {
    expect(dbHired.items).to.have.lengthOf(2);
    expect(dbHired.length).to.equal(2);
    const firstHire = dbHired.items[0];
    expect(firstHire.holidays).to.equal(25);
  });
});
