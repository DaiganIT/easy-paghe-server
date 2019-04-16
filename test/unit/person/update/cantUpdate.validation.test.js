import 'babel-polyfill';
import sinon from 'sinon';
import { expect } from 'chai';

import * as personSteps from '../steps';

import { UnitOfWorkFactory } from '../../../../database/unitOfWorkFactory';
import * as mocks from '../../mocks';

const personIn = {
  firstName: 'The name',
  lastName: 'The last name',
  phone: '45612345655',
  address: 'inkerman road',
  email: 'test@pietro.it',
};

const fieldsTestCases = [
  {
    field: 'firstName',
    fieldTest: 'First Name',
    tests: [
      {
        value: '',
        errors: ['First name ;Inserisci un nome'],
      },
      {
        value: ' ',
        errors: ['First name ;Inserisci un nome'],
      },
      {
        value: null,
        errors: ['First name ;Inserisci un nome'],
      },
      {
        value: undefined,
        errors: ['First name ;Inserisci un nome'],
      },
      {
        value: 'test',
        errors: [],
      },
    ]
  },
  {
    field: 'lastName',
    fieldTest: 'Last Name',
    tests: [
      {
        value: '',
        errors: ['Last name ;Inserisci un cognome'],
      },
      {
        value: ' ',
        errors: ['Last name ;Inserisci un cognome'],
      },
      {
        value: null,
        errors: ['Last name ;Inserisci un cognome'],
      },
      {
        value: undefined,
        errors: ['Last name ;Inserisci un cognome'],
      },
      {
        value: 'test',
        errors: [],
      },
    ]
  },
  {
    field: 'phone',
    fieldText: 'phone',
    tests: [
      {
        value: '',
        errors: ['Phone ;Il numero di telefono non e valido'],
      },
      {
        value: 'test',
        errors: ['Phone ;Il numero di telefono non e valido'],
      },
      {
        value: '54654',
        errors: [],
      },
    ],
  },
  {
    field: 'address',
    fieldText: 'address',
    tests: [
      {
        value: '',
        errors: [],
      },
      {
        value: 'test',
        errors: [],
      },
      {
        value: 'a'.repeat(256),
        errors: ['Address ;L\'indirizzo e troppo lungo'],
      },
    ],
  },
  {
    field: 'email',
    fieldText: 'email',
    tests: [
      {
        value: '',
        errors: ['Email ;L\'email non e valida'],
      },
      {
        value: 'test',
        errors: ['Email ;L\'email non e valida'],
      },
      {
        value: 'test@test.it',
        errors: [],
      },
    ],
  },
];

describe('Create Person DTO validation', () => {
  before(() => {
    sinon.createSandbox();
    sinon.stub(UnitOfWorkFactory, 'createAsync')
      .returns(new Promise(r => r(mocks.mockDb)));
  });
  after(() => {
    UnitOfWorkFactory.createAsync.restore();
  });

  fieldsTestCases.forEach(function (testCase) {
    let testPerson;
    let errors;
    describe(`Create Person fails for invalid ${testCase.fieldText}`, function () {
      testCase.tests.forEach(function (testCaseTest) {
        describe(`GIVEN I have a person dto with ${testCase.fieldText}: ${testCaseTest.value}`, function () {
          before(() => {
            mocks.repository.save.resetHistory();
          });
          describe('GIVEN I have a person in the database', () => {
            before(() => {
              mocks.queryBuilder.getOne = () => personIn;
              mocks.repository.save.resetHistory();
            });

            describe('WHEN I update the person', () => {
              before(async () => {
                testPerson = Object.assign({}, personIn, { [testCase.field]: testCaseTest.value });
                await personSteps.whenIUpdateThePersonAsync(1, testPerson, err => errors = err);
              });

              if (testCaseTest.errors.length > 0) {

                it(`THEN the ${testCase.fieldText} is invalid`, function () {
                  expect(errors).to.have.property(testCase.field);
                  expect(errors[testCase.field]).to.be.an('array');
                  testCaseTest.errors.forEach(function (expectedError) {
                    expect(errors[testCase.field]).to.include(expectedError);
                  });
                });

                it('THEN the person is not added', async function () {
                  expect(mocks.repository.save.called).to.be.false;
                });
              } else {
                it('THEN the person is added', async function () {
                  expect(mocks.repository.save.called).to.be.true;
                });
              }
            });
          });
        });
      });
    });
  });
});
