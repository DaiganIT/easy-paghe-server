import 'babel-polyfill';
import { expect } from 'chai';
import * as integrationSteps from '../../integration';
import * as hireSteps from '../steps';

function createCCNL (name) {
  return {
    name: name,
    originalDate: '2018-01-01',
    startDate: '2018-01-01',
    endDate: '2018-12-01',
    weekHours: 10,
    holidays: 30,
    extra: 1,
    night: 1,
    bankHolidays: 1,
    extraBankHolidays: 1,
    nightBankHolidays: 1,
    months: 13,
    salaryTable: [
      { isApprentice: true, level: 'level a', baseSalary: 1200, contingency: 0, thirdElement: 0, seniority: 0, hh: 150, gg: 26 },
      { isApprentice: true, level: 'level b', baseSalary: 1200, contingency: 0, thirdElement: 0, seniority: 0, hh: 150, gg: 26 },
      { isApprentice: false, level: 'level a', baseSalary: 1200, contingency: 0, thirdElement: 0, seniority: 0, hh: 150, gg: 26 },
      { isApprentice: false, level: 'level b', baseSalary: 1200, contingency: 0, thirdElement: 0, seniority: 0, hh: 150, gg: 26 }
    ]
  }
}

let index = 0;
const ccnls = [];
for (const _ of Array(25)) {
  ccnls.push(createCCNL(`ccnl ${index}`));
  index++;
}

describe('can get list of CCNL Levels', function () {
  let dbLevels;

  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have some ccnls in the database', async function () {
    for (const ccnl of ccnls)
      await hireSteps.whenICreateTheCCNLAsync(ccnl);
  });
  before('WHEN I use get list to get levels for the CCNL 3', async () => {
    dbLevels = await hireSteps.whenIGetCCNLLevelsListAsync(3);
  });

  it('THEN list is returned and salary table is empty', function () {
    expect(dbLevels.items).to.have.lengthOf(4);
    expect(dbLevels.length).to.equal(4);
  });
});