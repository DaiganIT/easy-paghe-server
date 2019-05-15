import 'babel-polyfill';
import sinon from 'sinon';
import { expect } from 'chai';

import * as hireSteps from '../steps';

import '../../../../models/validators/customDateRangeValidator';
import '../../../../models/validators/customDateTime';

import { UnitOfWorkFactory } from '../../../../database/unitOfWorkFactory';
import * as mocks from '../../mocks';

const fieldsTestCases = [
	{
		field: 'startDate',
		fieldText: 'start date',
		tests: [
			{
				value: null,
				errors: ['Start date ;Inserisci la data di inizio dell\'assunzione'],
			},
			{
				value: undefined,
				errors: ['Start date ;Inserisci la data di inizio dell\'assunzione'],
			},
			{
				value: '',
				errors: ['Start date ;Deve essere una data valida'],
			},
			{
				value: '2018-01-01',
				errors: [],
			},
		],
	},
	{
		field: 'endDate',
		fieldText: 'end date',
		tests: [
			{
				value: null,
				errors: [],
			},
			{
				value: undefined,
				errors: [],
			},
			{
				value: '',
				errors: ['End date ;Deve essere una data valida'],
			},
			{
				value: '2017-01-01',
				errors: ['End date ;La data di fine assunzione deve essere futura a quella di inizio'],
			},
			{
				value: '2019-01-01',
				errors: [],
			},
		],
	},
	{
		field: 'holidays',
		fieldText: 'holidays',
		tests: [
			{
				value: null,
				errors: [],
			},
			{
				value: undefined,
				errors: [],
			},
			{
				value: '',
				errors: ['Holidays ;Il numero di giorni di vacanza non e valido'],
			},
			{
				value: 'ten',
				errors: ['Holidays ;Il numero di giorni di vacanza non e valido'],
			},
			{
				value: -10,
				errors: ['Holidays ;Il numero di giorni di vacanza deve essere maggiore di 0'],
			},
			{
				value: '10',
				errors: [],
			},
			{
				value: 10,
				errors: [],
			},
			{
				value: 10.5,
				errors: [],
			},
		],
	},
	{
		field: 'weekHours',
		fieldText: 'week hours',
		tests: [
			{
				value: null,
				errors: [],
			},
			{
				value: undefined,
				errors: [],
			},
			{
				value: '',
				errors: ['Week hours ;Il numero di ore a settimana non e valido'],
			},
			{
				value: 'ten',
				errors: ['Week hours ;Il numero di ore a settimana non e valido'],
			},
			{
				value: -10,
				errors: ['Week hours ;Il numero di ore a settimana deve essere maggiore di 0'],
			},
			{
				value: 50,
				errors: ['Week hours ;Il numero di ore a settimana deve essere minore di 48'],
			},
			{
				value: '10',
				errors: [],
			},
			{
				value: 10,
				errors: [],
			},
			{
				value: 10.5,
				errors: [],
			},
		],
	},
];

describe.only('Hire Person DTO validation', () => {
	before(() => {
		sinon.sandbox.create();
		sinon.stub(UnitOfWorkFactory, 'createAsync')
			.returns(new Promise(r => r(mocks.mockDb)));
	});
	after(() => {
		UnitOfWorkFactory.createAsync.restore();
	});

	fieldsTestCases.forEach(function (testCase) {
		let testHireModel;
		let errors;
		describe(`Hire Person fails for invalid ${testCase.fieldText}`, function () {
			testCase.tests.forEach(function (testCaseTest) {
				describe(`GIVEN I have a hire person dto with ${testCase.fieldText}: ${testCaseTest.value}`, function () {
					before(() => {
						mocks.repository.save.resetHistory();
					});
					before('WHEN I use the manager to create hire the person', async function () {
						testHireModel = {
							startDate: '2018-01-01'
						};
						testHireModel[testCase.field] = testCaseTest.value;
						await hireSteps.whenIHireThePersonAsync(testHireModel, err => errors = err);
					});

					if (testCaseTest.errors.length > 0) {

						it(`THEN the ${testCase.fieldText} is invalid`, function () {
							expect(errors).to.have.property(testCase.field);
							expect(errors[testCase.field]).to.be.an('array');
							testCaseTest.errors.forEach(function (expectedError) {
								expect(errors[testCase.field]).to.include(expectedError);
							});
						});

						it('THEN the person is not hired', async function () {
							expect(mocks.repository.save.called).to.be.false;
						});
					} else {
						it('THEN the person is hired', async function () {
							expect(mocks.repository.save.called).to.be.true;
						});
					}
				});
			});
		});
	});
});
