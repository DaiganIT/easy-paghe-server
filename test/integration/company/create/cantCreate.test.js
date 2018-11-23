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
				errors: ['Fiscal code is invalid', 'Fiscal code is the wrong length (should be 16 characters)'],
			},
			{
				value: 'test',
				errors: ['Fiscal code is invalid', 'Fiscal code is the wrong length (should be 16 characters)'],
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
				errors: ['Iva code is the wrong length (should be 11 characters)'],
			},
			{
				value: 'test',
				errors: ['Iva code is the wrong length (should be 11 characters)'],
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
				errors: ['Address is too long (maximum is 255 characters)'],
      },
      {
				value: '',
				errors: [],
			},
		],
  },
  {
		field: 'inpsRegistrationNumnber',
		fieldText: 'inps reg number',
		tests: [
			{
				value: '',
				errors: ['Inps registration number is the wrong length (should be 10 characters)'],
      },
      {
				value: 'test',
				errors: ['Address is too long (maximum is 255 characters)'],
      },
      {
				value: '6546',
				errors: [''],
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
            expect(errors).to.have.property(testCase.field);
						expect(errors[testCase.field]).to.be.an('array');
            console.log(errors);
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
