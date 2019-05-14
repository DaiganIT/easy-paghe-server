// import 'babel-polyfill';
// import { expect } from 'chai';
// import * as integrationSteps from '../../integration';
// import * as companySteps from '../steps';
// import * as personSteps from '../../people/steps';

// const company = {
//   name: 'Company name',
//   bases: [{
//     name: 'Main Base',
//     address: 'The main address'
//   }, {
//     name: 'Additional Base',
//     address: 'The additional address',
//   }]
// }
// const people = [
//   { firstName: 'me', lastName: 'me' },
//   { firstName: 'you', lastName: 'you' },
//   { firstName: 'that guy', lastName: 'that guy' },
//   { firstName: 'somebody else', lastName: 'somebody else' },
// ];

// describe('GIVEN I have a company DTO', function () {
//   let employees;

//   before('GIVEN I have a database', async function () {
//     await integrationSteps.givenIHaveADatabaseAsync();
//   });
//   before('GIVEN I have a customer', async function () {
//     await integrationSteps.givenIHaveACustomerAsync();
//   });
//   before('GIVEN I have a company in the database', async function () {
//     await companySteps.whenICreateTheCompanyAsync(company);
//   });
//   before('GIVEN I have some persons in the database', async function () {
//     for(const person of people)
//       await personSteps.whenICreateThePersonAsync(person);
//   });
//   before('GIVEN I add me to the first base', async () => {
//     await companySteps.addEmployeeAsync(1, 1);
//   });
//   before('GIVEN I add you to the second base', async () => {
//     await companySteps.addEmployeeAsync(2, 2);
//   });
//   before('WHEN I get the list of all employees', async () => {
//     employees = await companySteps.whenIGetListOfAllEmployeesAsync(1);
//   });

//   it('THEN list is returned', function () {
//     expect(employees.items).to.have.lengthOf(2);
//     expect(employees.length).to.equal(2);
//     const me = employees.items[0];
//     const you = employees.items[1];
//     expect(me.firstName).to.equal('me');
//     expect(you.firstName).to.equal('you');
//   });
// });
