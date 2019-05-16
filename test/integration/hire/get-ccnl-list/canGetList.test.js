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

describe('GIVEN I have a CCNL in the database', function () {
  let dbCcnls;

  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have some ccnls in the database', async function () {
    for (const ccnl of ccnls)
      await hireSteps.whenICreateTheCCNLAsync(ccnl);
  });
  before('WHEN I use get list to get only the CCNLs', async () => {
    dbCcnls = await hireSteps.whenIGetCCNLListAsync();
  });

  it('THEN list is returned and salary table is empty', function () {
    expect(dbCcnls.items).to.have.lengthOf(10);
    expect(dbCcnls.length).to.equal(25);
    const oneCcnl = dbCcnls.items[0];
    expect(oneCcnl.salaryTable).to.not.be.ok;
  });
});

describe('GIVEN I have a CCNL in the database', function () {
  let dbCcnls;

  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have some ccnls in the database', async function () {
    for (const ccnl of ccnls)
      await hireSteps.whenICreateTheCCNLAsync(ccnl);
  });
  before('WHEN I use get list to get CCNLs and Salary Table', async () => {
    dbCcnls = await hireSteps.whenIGetCCNLListAsync(true);
  });

  it('THEN list is returned and salary table is not empty', function () {
    expect(dbCcnls.items).to.have.lengthOf(10);
    expect(dbCcnls.length).to.equal(25);
    const oneCcnl = dbCcnls.items[0];
    expect(oneCcnl.salaryTable).to.be.an('array');
    expect(oneCcnl.salaryTable).to.have.lengthOf(4);
  });
});
