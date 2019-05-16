import 'babel-polyfill';
import { expect } from 'chai';
import moment from 'moment';
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
const expectedHiredPerson = {
  id: 1,
  customer: undefined,
  startDate: '2015-01-01T00:00:00.000Z',
  endDate: '2016-01-01T00:00:00.000Z',
  weekHours: 30,
  holidays: 20,
  companyBase: undefined,
  person: undefined,
  ccnl: undefined,
  salaryTable: undefined
}

describe.only('GIVEN I have a company DTO', function () {
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
  before('WHEN The company hires a person', async () => {
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
  });
  it('THEN The person is hired', async function () {
    const db = await createDb();
    const hired = await db.getRepository(Hire).createQueryBuilder('hire')
      .innerJoinAndSelect('hire.customer', 'customer')
      .innerJoinAndSelect('hire.ccnl', 'ccnl')
      .innerJoinAndSelect('hire.companyBase', 'company_base')
      .innerJoinAndSelect('hire.person', 'person')
      .innerJoinAndSelect('hire.salaryTable', 'salary_table')
      .getMany();

    expect(hired).to.have.lengthOf(1);
    const hiredPerson = hired[0];

    expect(hiredPerson.customer.id).to.equal(1);
    expect(moment(hiredPerson.startDate).format()).to.equal(moment('2015-01-01').format());
    expect(moment(hiredPerson.endDate).format()).to.equal(moment('2016-01-01').format());
    expect(hiredPerson.weekHours).to.equal(30);
    expect(hiredPerson.holidays).to.equal(20);
    expect(hiredPerson.companyBase.id).to.equal(1);
    expect(hiredPerson.person.id).to.equal(1);
    expect(hiredPerson.ccnl.id).to.equal(1);
    expect(hiredPerson.salaryTable.id).to.equal(1);

    await db.close();
  });
});
