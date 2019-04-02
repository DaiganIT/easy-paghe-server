import 'babel-polyfill';
import sinon from 'sinon';
import { expect } from 'chai';

import * as companySteps from '../steps';
import * as mocks from '../../mocks';

import { UnitOfWorkFactory } from '../../../../database/unitOfWorkFactory';

describe('Update Company DTO for missing company', () => {
	before(() => {
		sinon.stub(UnitOfWorkFactory, 'createAsync')
			.returns(new Promise(r => r(mocks.mockDb)));
	});
	after(() => {
		UnitOfWorkFactory.createAsync.restore();
	});

	describe(`GIVEN I have a company dto`, function () {
		let errors;
		before(() => {
			mocks.repository.save.resetHistory();
		});
		before('WHEN I use the manager to update the company', async function () {
			await companySteps.whenIUpdateTheCompanyAsync(1, {}, err => errors = err);
		});

		it(`THEN the error is thrown`, function () {
			expect(errors).to.equal('Azienda non trovata');
		});

		it('THEN the company is not updated', async function () {
			expect(mocks.repository.save.called).to.be.false;
		});
	});
});
