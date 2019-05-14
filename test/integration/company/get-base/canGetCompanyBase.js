
import 'babel-polyfill';
import { expect } from 'chai';
import * as integrationSteps from '../../integration';
import * as companySteps from '../steps';
import * as personSteps from '../../people/steps';

const companyToAdd = {
  name: 'Company name',
  fiscalCode: 'CRTPTR88B21F158K',
  ivaCode: '45612345655',
  inpsRegistrationNumber: '4561237892',
  inailRegistrationNumber: '4567891234',
  bases: [{
    name: 'Main Base',
    address: 'The main address'
  }, {
    name: 'Additional Base',
    address: 'The additional address',
  }]
};
const people = [
  { firstName: 'me', lastName: 'me' },
  { firstName: 'you', lastName: 'you' },
  { firstName: 'that guy', lastName: 'that guy' },
];

// describe('GIVEN I have a company DTO', function () {
//   let companyBase;

//   before('GIVEN I have a database', async function () {
//     await integrationSteps.givenIHaveADatabaseAsync();
//   });
//   before('GIVEN I have a customer', async function () {
//     await integrationSteps.givenIHaveACustomerAsync();
//   });
//   before('GIVEN I have some companies in the database', async function () {
//     await companySteps.whenICreateTheCompanyAsync(companyToAdd);
//   });
//   before('GIVEN I have some persons in the database', async function () {
//     for (const person of people)
//       await personSteps.whenICreateThePersonAsync(person);
//   });
//   before('GIVEN I add some people to the company as employees', async () => {
//     await companySteps.addEmployeeAsync(1, 1);
//     await companySteps.addEmployeeAsync(1, 2);
//     await companySteps.addEmployeeAsync(2, 3);
//   });
//   before('WHEN I use get a company base', async () => {
//     companyBase = await companySteps.whenIGetCompanyBaseAsync(1);
//   });

//   it('THEN Company Base is returned', function () {
//     expect(companyBase.id).to.equal(1);
//     expect(companyBase.name).to.equal('Main Base');
//     expect(companyBase.address).to.equal('The main address');
//     expect(companyBase.hirees).to.not.be.ok;
//     expect(companyBase.hirees).to.not.be.ok;
//   });
// });

// describe('GIVEN I have a company DTO', function () {
//   let companyBase;

//   before('GIVEN I have a database', async function () {
//     await integrationSteps.givenIHaveADatabaseAsync();
//   });
//   before('GIVEN I have a customer', async function () {
//     await integrationSteps.givenIHaveACustomerAsync();
//   });
//   before('GIVEN I have some companies in the database', async function () {
//     await companySteps.whenICreateTheCompanyAsync(companyToAdd);
//   });
//   before('GIVEN I have some persons in the database', async function () {
//     for (const person of people)
//       await personSteps.whenICreateThePersonAsync(person);
//   });
//   before('GIVEN I add some people to the company as employees', async () => {
//     await companySteps.addEmployeeAsync(1, 1);
//     await companySteps.addEmployeeAsync(1, 2);
//     await companySteps.addEmployeeAsync(2, 3);
//   });
//   before('WHEN I use get a company base', async () => {
//     companyBase = await companySteps.whenIGetCompanyBaseAsync(1, true);
//   });

//   it('THEN Company Base is returned', function () {
//     expect(companyBase.id).to.equal(1);
//     expect(companyBase.name).to.equal('Main Base');
//     expect(companyBase.address).to.equal('The main address');
//     expect(companyBase.hirees).to.have.lengthOf(2);
//   });
// });

describe('GIVEN I have a company DTO', function () {
  let companyBase;

  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have some companies in the database', async function () {
    await companySteps.whenICreateTheCompanyAsync(companyToAdd);
  });
  before('WHEN I use get a company base', async () => {
    companyBase = await companySteps.whenIGetCompanyBaseAsync(1, false);
  });

  it('THEN Company Base is returned', function () {
    expect(companyBase.id).to.equal(1);
    expect(companyBase.name).to.equal('Main Base');
    expect(companyBase.address).to.equal('The main address');
    expect(companyBase.hirees).to.not.be.ok;
  });
});

describe('GIVEN I have a company DTO', function () {
  let companyBase;

  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have some companies in the database', async function () {
    await companySteps.whenICreateTheCompanyAsync(companyToAdd);
  });
  before('WHEN I use get a company base', async () => {
    companyBase = await companySteps.whenIGetCompanyBaseAsync(1, true);
  });

  it('THEN Company Base is returned', function () {
    expect(companyBase.id).to.equal(1);
    expect(companyBase.name).to.equal('Main Base');
    expect(companyBase.address).to.equal('The main address');
    expect(companyBase.hirees).to.have.lengthOf(0);
  });
});