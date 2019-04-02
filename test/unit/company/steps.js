
import { CompanyManager } from 'Managers/companyManager';

export const whenICreateTheCompanyAsync = async (company, setErrors) => {
  try {
    const companyManager = new CompanyManager({});
    await companyManager.addAsync(company);
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};

export const whenIUpdateTheCompanyAsync = async (companyId, company, setErrors) => {
  try {
    const companyManager = new CompanyManager({});
    await companyManager.updateAsync(companyId, company);
  } catch (err) {
    console.log(err);
    if (setErrors) setErrors(err);
  }
};