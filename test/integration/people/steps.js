
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

export const whenIUpdateThePersonAsync = async (personId, person, setErrors) => {
  const [db, personManager] = await createPersonManagerAsync();

  try {
    await personManager.updateAsync(personId, person);
    await db.close();
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};

export const whenIDeleteThePersonAsync = async (personId, setErrors) => {
  const [db, personManager] = await createPersonManagerAsync();

  try {
    await personManager.deleteAsync(personId);
    await db.close();
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};

export const whenIGetPersonAsync = async (personId, setErrors) => {
  const [db, personManager] = await createPersonManagerAsync();

  try {
    const person = await personManager.getByIdAsync(personId);
    await db.close();
    return person;
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};

export const whenIGetListAsync = async (filter, page, pageLimit, setErrors) => {
  const [db, personManager] = await createPersonManagerAsync();

  try {
    const people = await personManager.getAsync(filter, page, pageLimit);
    await db.close();
    return people;
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};

async function createPersonManagerAsync() {
  const db = await createDb();
  const testCustomer = (await db.getRepository(Customer).find())[0];
  const user = { name: 'Pietro', customer: testCustomer };
  return [db, new PersonManager(user)];
}