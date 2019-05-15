
import { HireManager } from 'Managers/hireManager';

export const whenIHireThePersonAsync = async (hirePersonModel, setErrors) => {
  try {
    const hireManager = new HireManager({ customer: {} });
    await hireManager.hirePersonAsync(hirePersonModel);
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};
