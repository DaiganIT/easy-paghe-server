
import createDb from '../testUnitOfWork';
import { Customer } from 'Entities/customer';
import { HistoryManager } from 'Managers/historyManager';

export const whenICreateTheHistoryAsync = async (history, setErrors) => {
  const [db, historyManager] = await createHistoryManagerAsync();

  try {
    await historyManager.addAsync([history]);
    await db.close();
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};

export const whenIGetListAsync = async (entity, itemId, filter, page, pageLimit, setErrors) => {
  const [db, historyManager] = await createHistoryManagerAsync();

  try {
    let histories = await historyManager.getAsync(entity, itemId, filter, page, pageLimit);
    await db.close();
    return histories;
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
}

async function createHistoryManagerAsync() {
  const db = await createDb();
  const testCustomer = (await db.getRepository(Customer).find())[0];
  const user = { name: 'Pietro', customer: testCustomer };
  return [db, new HistoryManager(user)];
}
