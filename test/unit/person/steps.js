
import { PersonManager } from 'Managers/personManager';

export const whenICreateThePersonAsync = async (person, setErrors) => {
  try {
    const personManager = new PersonManager({ customer: {} });
    await personManager.addAsync(person);
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};

export const whenIUpdateThePersonAsync = async (personId, person, setErrors) => {
  try {
    const personManager = new PersonManager({ customer: {} });
    await personManager.updateAsync(personId, person);
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};