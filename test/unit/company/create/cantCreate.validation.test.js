import 'babel-polyfill';
import sinon from 'sinon';
import { expect } from 'chai';

import * as companySteps from '../steps';

import { UnitOfWorkFactory } from '../../../../database/unitOfWorkFactory';
import { CompanyManager } from 'managers/companyManager';
import * as mocks from '../../mocks';

const nameTests = [
	{
		value: '',
		errors: ['Name ;Inserisci un nome'],
	},
	{
		value: ' ',
		errors: ['Name ;Inserisci un nome'],
	},
	{
		value: null,
		errors: ['Name ;Inserisci un nome'],
	},
	{
		value: undefined,
		errors: ['Name ;Inserisci un nome'],
	},
	{
		value: 'test',
		errors: [],
	},
];
const fieldsTestCases = [
	{
		field: 'fiscalCode',
		fieldText: 'fiscal code',
		tests: [
			{
				value: '',
				errors: ['Fiscal code ;Il codice fiscale non e valido'],
			},
			{
				value: 'test',
				errors: ['Fiscal code ;Il codice fiscale non e valido'],
			},
			{
				value: 'CRTPTR88B21F158K',
				errors: [],
			},
		],
	},
	{
		field: 'ivaCode',
		fieldText: 'iva code',
		tests: [
			{
				value: '',
				errors: ['Iva code ;La partita IVA non e valida'],
			},
			{
				value: 'test',
				errors: ['Iva code ;La partita IVA non e valida'],
			},
			{
				value: '54655645654',
				errors: [],
			},
		],
	},
	{
		field: 'inpsRegistrationNumber',
		fieldText: 'INPS reg number',
		tests: [
			{
				value: '',
				errors: ['Inps registration number ;Il Codice INPS non e valido'],
			},
			{
				value: 'test',
				errors: ['Inps registration number ;Il Codice INPS non e valido', 'Inps registration number ;Il Codice INPS non e valido'],
			},
			{
				value: '6546',
				errors: ['Inps registration number ;Il Codice INPS non e valido'],
			},
			{
				value: '6546684456',
				errors: [],
			},
		],
	},
	{
		field: 'inailRegistrationNumber',
		fieldText: 'INAIL reg number',
		tests: [
			{
				value: '',
				errors: ['Inail registration number ;Il Codice INAIL non e valido'],
			},
			{
				value: 'test',
				errors: ['Inail registration number ;Il Codice INAIL non e valido', 'Inail registration number ;Il Codice INAIL non e valido'],
			},
			{
				value: '6546',
				errors: ['Inail registration number ;Il Codice INAIL non e valido'],
			},
			{
				value: '6546684456',
				errors: [],
			},
		],
	},
];
const testCasesBaseName = [
	{
		value: '',
		errors: ['Name ;Inserisci un nome'],
	},
	{
		value: ' ',
		errors: ['Name ;Inserisci un nome'],
	},
	{
		value: null,
		errors: ['Name ;Inserisci un nome'],
	},
	{
		value: undefined,
		errors: ['Name ;Inserisci un nome'],
	},
	{
		value: 'test',
		errors: [],
	},
];
const testCasesBases = [
	{
		field: 'address',
		fieldText: 'address',
		tests: [
			{
				value: 'a'.repeat(256),
				errors: ['Address ;L\'indirizzo e troppo lungo'],
			},
			{
				value: 'a',
				errors: [],
			},
		],
	},
];

describe('Create Company DTO validation', () => {
	before(() => {
		sinon.sandbox.create();
		sinon.stub(UnitOfWorkFactory, 'createAsync')
			.returns(new Promise(r => r(mocks.mockDb)));
	});
	after(() => {
		UnitOfWorkFactory.createAsync.restore();
	});

	nameTests.forEach(function (testCase) {
		let testCompany;
		let errors;

		describe(`GIVEN I have a company dto with name: ${testCase.value}`, function () {
			before(() => {
				mocks.repository.save.resetHistory();
			});
			before('WHEN I use the manager to create the company', async function () {
				testCompany = {
					name: testCase.value,
				};
				await companySteps.whenICreateTheCompanyAsync(testCompany, err => errors = err);
			});

			if (testCase.errors.length > 0) {
				it(`THEN the name is invalid`, function () {
					expect(errors).to.have.property('name');
					expect(errors.name).to.be.an('array');
					testCase.errors.forEach(function (expectedError) {
						expect(errors.name).to.include(expectedError);
					});
				});

				it('THEN the company is not added', async function () {
					expect(mocks.repository.save.called).to.be.false;
				});
			} else {
				it('THEN the company is added', async function () {
					expect(mocks.repository.save.called).to.be.true;
				});
			}
		});
	});

	fieldsTestCases.forEach(function (testCase) {
		let testCompany;
		let errors;
		describe(`Create Company fails for invalid ${testCase.fieldText}`, function () {
			testCase.tests.forEach(function (testCaseTest) {
				describe(`GIVEN I have a company dto with ${testCase.fieldText}: ${testCaseTest.value}`, function () {
					before(() => {
						mocks.repository.save.resetHistory();
					});
					before('WHEN I use the manager to create the company', async function () {
						testCompany = {
							name: 'Test company',
							[testCase.field]: testCaseTest.value
						};
						await companySteps.whenICreateTheCompanyAsync(testCompany, err => errors = err);
					});

					if (testCaseTest.errors.length > 0) {

						it(`THEN the ${testCase.fieldText} is invalid`, function () {
							expect(errors).to.have.property(testCase.field);
							expect(errors[testCase.field]).to.be.an('array');
							testCaseTest.errors.forEach(function (expectedError) {
								expect(errors[testCase.field]).to.include(expectedError);
							});
						});

						it('THEN the company is not added', async function () {
							expect(mocks.repository.save.called).to.be.false;
						});
					} else {
						it('THEN the company is added', async function () {
							expect(mocks.repository.save.called).to.be.true;
						});
					}
				});
			});
		});
	});

	testCasesBaseName.forEach(testCase => {
		let testCompany;
		let errors;
		describe(`GIVEN I have a company dto with base name: ${testCase.value}`, function () {
			before(() => {
				mocks.repository.save.resetHistory();
			});
			before('WHEN I use the manager to create the company', async function () {
				testCompany = {
					name: 'Test company',
					bases: [{
						name: testCase.value,
					}]
				};
				await companySteps.whenICreateTheCompanyAsync(testCompany, err => errors = err);
			});

			if (testCase.errors.length > 0) {
				it(`THEN the name is invalid`, function () {
					expect(errors).to.have.property('bases');
					expect(errors.bases).to.have.property('0');
					expect(errors.bases[0]).to.have.property('name');
					expect(errors.bases[0].name).to.be.an('array');
					testCase.errors.forEach(function (expectedError) {
						expect(errors.bases[0].name).to.include(expectedError);
					});
				});

				it('THEN the company is not added', async function () {
					expect(mocks.repository.save.called).to.be.false;
				});
			} else {
				it('THEN the company is added', async function () {
					expect(mocks.repository.save.called).to.be.true;
				});
			}
		});
	});

	testCasesBases.forEach(testCase => {
		describe(`Create Company fails for invalid base ${testCase.fieldText}`, function () {
			let testCompany;
			let errors;

			testCase.tests.forEach(function (testCaseTest) {
				describe(`GIVEN I have a company dto with base ${testCase.fieldText}: ${testCaseTest.value}`, function () {
					before(() => {
						mocks.repository.save.resetHistory();
					});
					before('WHEN I use the manager to create the company', async function () {
						testCompany = {
							name: 'Test company',
							bases: [{
								name: 'Test Base',
								[testCase.field]: testCaseTest.value
							}]
						};
						await companySteps.whenICreateTheCompanyAsync(testCompany, err => errors = err);
					});

					if (testCaseTest.errors.length > 0) {
						it(`THEN the ${testCase.fieldText} is invalid`, function () {
							expect(errors).to.have.property('bases');
							expect(errors.bases).to.have.property('0');
							expect(errors.bases[0]).to.have.property(testCase.field);
							expect(errors.bases[0][testCase.field]).to.be.an('array');
							testCaseTest.errors.forEach(function (expectedError) {
								expect(errors.bases[0][testCase.field]).to.include(expectedError);
							});
						});

						it('THEN the company is not added', async function () {
							expect(mocks.repository.save.called).to.be.false;
						});
					} else {
						it('THEN the company is added', async function () {
							expect(mocks.repository.save.called).to.be.true;
						});
					}
				});
			});
		});
	});
});

describe(`Cannot create Company Manager without a Customer`, function () {
	let errors;

	describe('WHEN I create the company manager', () => {
		try {
			new CompanyManager({ customer: null });
		} catch (err) {
			errors = err;
		}

		it('THEN An error is thrown', () => {
			expect(errors).to.be.ok;
			expect(errors).to.equal('Customer is not defined');
		});
	});
});