
import { expect } from 'chai';

import createDb from '../testUnitOfWork';
import { Customer } from 'Entities/customer';
import { Company } from 'Entities/company';
import { CompanyManager } from 'Managers/companyManager';

export const whenICreateTheCompanyAsync = async (company, setErrors) => {
  const [db, companyManager] = await createCompanyManagerAsync();

  try {
    await companyManager.addAsync(company);
    await db.close();
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};

export const whenIUpdateTheCompanyAsync = async (companyId, company, setErrors) => {
  const [db, companyManager] = await createCompanyManagerAsync();

  try {
    await companyManager.updateAsync(companyId, company);
    await db.close();
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};

export const whenIGetListAsync = async (filter, page, pageLimit, setErrors) => {
  const [db, companyManager] = await createCompanyManagerAsync();

  try {
    let companies = await companyManager.getAsync(filter, page, pageLimit);
    await db.close();
    return companies;
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
}

export const whenIGetBasesListAsync = async (companyId, filter, page, pageLimit, setErrors) => {
  const [db, companyManager] = await createCompanyManagerAsync();

  try {
    let companyBases = await companyManager.getBasesAsync(companyId, filter, page, pageLimit);
    await db.close();
    return companyBases;
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
}

export const addEmployeeAsync = async (companyBaseId, personId, setErrors) => {
  const [db, companyManager] = await createCompanyManagerAsync();

  try {
    await companyManager.addEmployeeAsync(companyBaseId, personId);
    await db.close();
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
}

export const removeEmployeeAsync = async (personId, setErrors) => {
  const [db, companyManager] = await createCompanyManagerAsync();

  try {
    await companyManager.removeEmployeeAsync(personId);
    await db.close();
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
}

export const whenIGetCompanyAsync = async (companyId, withEmployees) => {
  const [db, companyManager] = await createCompanyManagerAsync();

  try {
    const company = await companyManager.getByIdAsync(companyId, withEmployees);
    await db.close();
    return company;
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
}

export const whenIGetCompanyBaseAsync = async (companyId, withEmployees) => {
  const [db, companyManager] = await createCompanyManagerAsync();

  try {
    const company = await companyManager.getBaseByIdAsync(companyId, withEmployees);
    await db.close();
    return company;
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
}

export const whenIGetListOfAllEmployeesAsync = async (companyId, filter, page, pageLimit, setErrors) => {
  const [db, companyManager] = await createCompanyManagerAsync();

  try {
    const employees = await companyManager.getAllEmployeesAsync(companyId, filter, page, pageLimit);
    await db.close();
    return employees;
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
}

export const whenIGetListOfBaseEmployeesAsync = async (companyBaseId, filter, page, pageLimit, setErrors) => {
  const [db, companyManager] = await createCompanyManagerAsync();

  try {
    const employees = await companyManager.getBaseEmployeesAsync(companyBaseId, filter, page, pageLimit);
    await db.close();
    return employees;
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
}

export const whenIDeleteCompanyAsync = async (companyId, withEmployees, setErrors) => {
  const [db, companyManager] = await createCompanyManagerAsync();

  try {
    await companyManager.deleteAsync(companyId, withEmployees);
    await db.close();
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
}

export const whenIDeleteCompanyBaseAsync = async (companyBaseId, withEmployees, setErrors) => {
  const [db, companyManager] = await createCompanyManagerAsync();

  try {
    await companyManager.deleteBaseAsync(companyBaseId, withEmployees);
    await db.close();
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
}

async function createCompanyManagerAsync() {
  const db = await createDb();
  const testCustomer = (await db.getRepository(Customer).find())[0];
  const user = { name: 'Pietro', customer: testCustomer };
  return [db, new CompanyManager(user)];
}

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