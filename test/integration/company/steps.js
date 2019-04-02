
import { expect } from 'chai';

import createDb from '../testUnitOfWork';
import { Customer } from 'Entities/customer';
import { Company } from 'Entities/company';
import { CompanyManager } from 'Managers/companyManager';

export const whenICreateTheCompanyAsync = async (company, setErrors) => {
  const db = await createDb();
  const testCustomer = (await db.getRepository(Customer).find())[0];
  const companyManager = new CompanyManager(testCustomer);

  try {
    await companyManager.addAsync(company);
    await db.close();
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};

export const whenIUpdateTheCompanyAsync = async (companyId, company, setErrors) => {
  const db = await createDb();
  const testCustomer = (await db.getRepository(Customer).find())[0];
  const companyManager = new CompanyManager(testCustomer);

  try {
    await companyManager.updateAsync(companyId, company);
    await db.close();
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};

export const thenTheCompanyIsNotAdded = () => {
  it('THEN the company is not added', async function () {
    const db = await createDb();
    const companies = await db.getRepository(Company).find();

    expect(companies).to.have.lengthOf(0);
    await db.close();
  });
}

export const thenTheCompanyIsAdded = () => {
  it('THEN the company is added', async function () {
    const db = await createDb();
    const companies = await db.getRepository(Company).find();

    expect(companies).to.have.lengthOf(1);
    await db.close();
  });
}