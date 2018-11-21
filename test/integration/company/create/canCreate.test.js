import 'babel-polyfill';
import { expect } from 'chai';
import { CompanyManager } from 'Managers/companyManager';
import { Customer } from 'Entities/customer';
import { Company } from 'Entities/company';
import { steps } from '../../integration';
import createDb from '../../testUnitOfWork';

describe('Can Create a Company', function () {
  let testCompany;

  steps.givenIHaveADatabase();
  steps.givenIHaveACustomer();

  before('GIVEN I have a company dto with only the name', function () {
    testCompany = {
      name: 'Test company'
    };
  });

  before('WHEN I use the manager to create the company', async function () {
    const db = await createDb();
    const testCustomer = await db.getRepository(Customer).find()[0];
    const companyManager = new CompanyManager(testCustomer);

    await companyManager.addAsync(testCompany);
    await db.close();
  });

  it('THEN the company is added', async function () {
    const db = await createDb();
    const companies = await db.getRepository(Company)
      .find();

    expect(companies).to.have.lengthOf(1);
    await db.close();
  });
});