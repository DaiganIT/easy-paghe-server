import 'babel-polyfill';
import { expect } from 'chai';
import * as integrationSteps from '../../integration';
import * as personSteps from '../steps';

const companyToAdd = {
  firstName: 'Pietro',
  lastName: 'Carta',
  email: 'pietro.carta88@gmail.com',
  phone: '68546',
  address: '35 Inkerman Road'
};

describe('GIVEN I have a person DTO', function () {
  let person;

  before('GIVEN I have a database', async function () {
    await integrationSteps.givenIHaveADatabaseAsync();
  });
  before('GIVEN I have a customer', async function () {
    await integrationSteps.givenIHaveACustomerAsync();
  });
  before('GIVEN I have a person in the database', async function () {
    await personSteps.whenICreateThePersonAsync(companyToAdd);
  });
  before('WHEN I use get a person', async () => {
    person = await personSteps.whenIGetPersonAsync(1);
  });

  it('THEN Company is returned', function () {
    expect(person.id).to.equal(1);
    expect(person.firstName).to.equal('Pietro');
    expect(person.lastName).to.equal('Carta');
    expect(person.phone).to.equal('68546');
    expect(person.address).to.equal('35 Inkerman Road');
    expect(person.email).to.equal('pietro.carta88@gmail.com');
  });
});
