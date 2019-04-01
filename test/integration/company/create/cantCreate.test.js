import 'babel-polyfill';
import { expect } from 'chai';
import { CompanyManager } from 'Managers/companyManager';
import { Customer } from 'Entities/customer';
import { Company } from 'Entities/company';
import { steps } from '../../integration';
import createDb from '../../testUnitOfWork';

const testCases = [
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
		field: 'address',
		fieldText: 'address',
		tests: [
			{
				value: 'a'.repeat(256),
				errors: ['Address ;L\'Indirizzo e troppo lungo'],
      },
      {
				value: '',
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

testCases.forEach(function(testCase) {
	describe(`Create Company fails for invalid ${testCase.fieldText}`, function() {
		let testCompany;
		let errors;

		steps.givenIHaveADatabase();
		steps.givenIHaveACustomer();

		testCase.tests.forEach(function(testCaseTest) {
			describe(`GIVEN I have a company dto with ${testCase.fieldText}: ${testCaseTest.value}`, function() {
				before(function() {
					testCompany = {
						name: 'Test company',
						[testCase.field]: testCaseTest.value,
					};
				});

				describe('WHEN I use the manager to create the company', function() {
					before(async function() {
						const db = await createDb();
						const testCustomer = await db.getRepository(Customer).find()[0];
						const companyManager = new CompanyManager(testCustomer);

						try {
							await companyManager.addAsync(testCompany);
							await db.close();
						} catch (err) {
							errors = err;
						}
					});

					it(`THEN the ${testCase.fieldText} is invalid`, function() {
						console.log(errors);
            expect(errors).to.have.property(testCase.field);
						expect(errors[testCase.field]).to.be.an('array');
						testCaseTest.errors.forEach(function(expectedError) {
							expect(errors[testCase.field]).to.include(expectedError);
						});
					});

					if (testCaseTest.errors.length > 0) {
						it('THEN the company is not added', async function() {
							const db = await createDb();
							const companies = await db.getRepository(Company).find();

							expect(companies).to.have.lengthOf(0);
							await db.close();
						});
					} else {
						it('THEN the company is added', async function() {
							const db = await createDb();
							const companies = await db.getRepository(Company).find();

							expect(companies).to.have.lengthOf(1);
							await db.close();
						});
					}
				});
			});
		});
	});
});
