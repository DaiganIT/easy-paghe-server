
import createDb from '../testUnitOfWork';
import { CCNLManager } from 'managers/ccnlManager';
import { CCNL } from 'entities/ccnl';
import { HireManager } from 'managers/hireManager';
import { Customer } from 'entities/customer';

export const whenICreateTheCCNLAsync = async (ccnl, setErrors) => {
  const db = await createDb();

  try {
    await db.getRepository(CCNL).save(ccnl);
    await db.close();
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};

export const whenIGetCCNLListAsync = async (withSalaryTable, filter, page, pageLimit, setErrors) => {
  const [db, ccnlManager] = await createCCNLManagerAsync();

  try {
    let ccnls = await ccnlManager.getAsync(withSalaryTable, filter, page, pageLimit);
    await db.close();
    return ccnls;
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
}

export const whenIGetCCNLLevelsListAsync = async (ccnlId, filter, page, pageLimit, setErrors) => {
  const [db, ccnlManager] = await createCCNLManagerAsync();

  try {
    let ccnls = await ccnlManager.getLevelsAsync(ccnlId, filter, page, pageLimit);
    await db.close();
    return ccnls;
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
}

export const whenTheCompanyHiresAPerson = async (hirePersonDto, setErrors) => {
  const [db, hireManager] = await createHireManagerAsync();

  try {
    await hireManager.hirePersonAsync(hirePersonDto);
    await db.close();
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
}

export const whenIGetListAsync = async (filter, page, pageLimit, setErrors) => {
  const [db, hireManager] = await createHireManagerAsync();

  try {
    let hired = await hireManager.getAsync(filter, page, pageLimit);
    await db.close();
    return hired;
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
}

async function createHireManagerAsync() {
  const db = await createDb();
  const testCustomer = (await db.getRepository(Customer).find())[0];
  const user = { name: 'Pietro', customer: testCustomer };
  return [db, new HireManager(user)];
}

async function createCCNLManagerAsync() {
  const db = await createDb();
  const user = { name: 'Pietro', customer: {} };
  return [db, new CCNLManager(user)];
}
