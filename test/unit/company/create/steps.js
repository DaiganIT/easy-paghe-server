
import { CompanyManager } from 'Managers/companyManager';

export const whenICreateTheCompanyAsync = async (company, setErrors) => {
  try {
    const companyManager = new CompanyManager({});
    await companyManager.addAsync(company);
  } catch (err) {
    if (setErrors) setErrors(err);
  }
};