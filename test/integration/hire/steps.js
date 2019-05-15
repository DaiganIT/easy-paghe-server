
import createDb from '../testUnitOfWork';
import { CCNLManager } from 'managers/ccnlManager';
import { CCNL } from 'entities/ccnl';

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

async function createCCNLManagerAsync() {
  const db = await createDb();
  const user = { name: 'Pietro', customer: {} };
  return [db, new CCNLManager(user)];
}
