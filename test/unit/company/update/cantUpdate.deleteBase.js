import 'babel-polyfill';
import sinon from 'sinon';
import { expect } from 'chai';

import * as companySteps from '../steps';
import * as mocks from '../../mocks';

import { UnitOfWorkFactory } from '../../../../database/unitOfWorkFactory';

const companyIn = {
	id: 1,
	name: 'The name',
	fiscalCode: 'CRTPTR88B21F158K',
	ivaCode: '45612345655',
	inpsRegistrationNumber: '4561237892',
	inailRegistrationNumber: '4567891234',
	bases: [{
		id: 1,
		name: 'Main Base',
		address: 'The main address'
	}, {
		id: 2,
		name: 'Additional Base',
		address: 'The additional address',
	}]
};

const testCases = [
	{
		bases: [
			{
				id: 1,
				name: 'Main Base',
				address: 'The main address'
			}
		],
		error: 'Aggiorna azienda non puo essere usato per eliminare sedi'
	},
	{
		bases: [
			{
				id: 1,
				name: 'Main Base',
				address: 'The main address'
			},
			{
				name: 'Added',
				address: 'Added'
			}
		],
		error: 'Aggiorna azienda non puo essere usato per eliminare sedi'
	}
];

describe('Update Company DTO for missing company', () => {
	before(() => {
		sinon.stub(UnitOfWorkFactory, 'createAsync')
			.returns(new Promise(r => r(mocks.mockDb)));
	});
	after(() => {
		UnitOfWorkFactory.createAsync.restore();
	});

	testCases.forEach(test => {

		describe(`GIVEN I have a company dto`, function () {
			let errors;
			before(() => {
				mocks.queryBuilder.getOne = () => companyIn;
			});
			before(() => {
				mocks.repository.save.resetHistory();
			});
			before('WHEN I use the manager to update the company', async function () {
				await companySteps.whenIUpdateTheCompanyAsync(1, { bases: test.bases }, err => errors = err);
			});

			it(`THEN the error is thrown`, function () {
				expect(errors).to.equal('Aggiorna azienda non puo essere usato per eliminare sedi');
			});

			it('THEN the company is not updated', async function () {
				expect(mocks.repository.save.called).to.be.false;
			});
		});
	});
});