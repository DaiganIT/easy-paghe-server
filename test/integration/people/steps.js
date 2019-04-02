
import createDb from '../testUnitOfWork';
import { Customer } from 'Entities/customer';
import { PersonManager } from 'Managers/personManager';

export const whenICreateThePersonAsync = async (person, setErrors) => {
  const [db, personManager] = await createPersonManagerAsync();

  try {
    await personManager.addAsync(person);
    await db.close();
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};

async function createPersonManagerAsync() {
  const db = await createDb();
  const testCustomer = (await db.getRepository(Customer).find())[0];
  return [db, new PersonManager(testCustomer)];
}