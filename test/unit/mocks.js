import sinon from 'sinon';

export const repository = { 
  save: sinon.spy(),
	createQueryBuilder: () => queryBuilder,
	findOne: sinon.spy(() => 'found')
};

export const queryBuilder = {
	innerJoinAndSelect: () => queryBuilder,
	innerJoin: () => queryBuilder,
	leftJoinAndSelect: () => queryBuilder,
	where: () => queryBuilder,
	getOne: () => undefined
};

export const mockDb = { getRepository: () => repository };