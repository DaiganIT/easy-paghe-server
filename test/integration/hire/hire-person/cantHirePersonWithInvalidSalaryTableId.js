
import 'babel-polyfill';
import { expect } from 'chai';
import * as integrationSteps from '../../integration';
import * as companySteps from '../../company/steps';
import * as personSteps from '../../people/steps';
import * as hireSteps from '../steps';
import createDb from '../../testUnitOfWork';
import { Hire } from 'entities/hire';

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

describe('GIVEN I have a company DTO', function () {
  let errors;
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
  before('WHEN The company hires a person with invalid salaryTableId', async () => {
    await hireSteps.whenTheCompanyHiresAPerson({
      startDate: '2015-01-01',
      endDate: '2016-01-01',
      holidays: 20,
      weekHours: 30,
      companyBaseId: 1,
      personId: 1,
      ccnlId: 1,
      salaryTableId: 10
    }, err => errors = err);
  });
  it('THEN The person is not hired', async function () {
    const db = await createDb();
    const hired = await db.getRepository(Hire).createQueryBuilder('hire')
      .getMany();

    expect(hired).to.have.lengthOf(0);
    await db.close();
  });
  it('THEN The error is invalid salary table', () => {
    expect(errors).to.equal('Livello non valido');
  });
});
