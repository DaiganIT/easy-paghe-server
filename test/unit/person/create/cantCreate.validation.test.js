import 'babel-polyfill';
import sinon from 'sinon';
import { expect } from 'chai';

import * as personSteps from '../steps';

import { UnitOfWorkFactory } from '../../../../database/unitOfWorkFactory';
import { PersonManager } from 'managers/personManager';
import * as mocks from '../../mocks';

const nameTests = [
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
];
const lastNameTests = [
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
];
const fieldsTestCases = [
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

  nameTests.forEach(function (testCase) {
    let testPerson;
    let errors;

    describe(`GIVEN I have a person dto with name: ${testCase.value}`, function () {
      before(() => {
        mocks.repository.save.resetHistory();
      });
      before('WHEN I use the manager to create the person', async function () {
        testPerson = {
          firstName: testCase.value,
          lastName: 'test'
        };
        await personSteps.whenICreateThePersonAsync(testPerson, err => errors = err);
      });

      if (testCase.errors.length > 0) {
        it(`THEN the first name is invalid`, function () {
          expect(errors).to.have.property('firstName');
          expect(errors.firstName).to.be.an('array');
          testCase.errors.forEach(function (expectedError) {
            expect(errors.firstName).to.include(expectedError);
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

  lastNameTests.forEach(function (testCase) {
    let testPerson;
    let errors;

    describe(`GIVEN I have a person dto with name: ${testCase.value}`, function () {
      before(() => {
        mocks.repository.save.resetHistory();
      });
      before('WHEN I use the manager to create the person', async function () {
        testPerson = {
          lastName: testCase.value,
          firstName: 'test'
        };
        await personSteps.whenICreateThePersonAsync(testPerson, err => errors = err);
      });

      if (testCase.errors.length > 0) {
        it(`THEN the last name is invalid`, function () {
          expect(errors).to.have.property('lastName');
          expect(errors.lastName).to.be.an('array');
          testCase.errors.forEach(function (expectedError) {
            expect(errors.lastName).to.include(expectedError);
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

  fieldsTestCases.forEach(function (testCase) {
    let testPerson;
    let errors;
    describe(`Create Person fails for invalid ${testCase.fieldText}`, function () {
      testCase.tests.forEach(function (testCaseTest) {
        describe(`GIVEN I have a person dto with ${testCase.fieldText}: ${testCaseTest.value}`, function () {
          before(() => {
            mocks.repository.save.resetHistory();
          });
          before('WHEN I use the manager to create the person', async function () {
            testPerson = {
              firstName: 'Test person name',
              lastName: 'Test person last name',
              [testCase.field]: testCaseTest.value
            };
            await personSteps.whenICreateThePersonAsync(testPerson, err => errors = err);
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

describe(`Cannot create Person Manager without a Customer`, function () {
  let errors;

  describe('WHEN I create the person manager', () => {
    try {
      new PersonManager({ customer: null });
    } catch (err) {
      errors = err;
    }

    it('THEN An error is thrown', () => {
      expect(errors).to.be.ok;
      expect(errors).to.equal('Customer is not defined');
    });
  });
});