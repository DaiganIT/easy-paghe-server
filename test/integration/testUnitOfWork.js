import { UnitOfWorkFactory } from 'Database/unitOfWorkFactory';

const testConnection = {
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: 'root',
	password: 'root',
	supportBigNumbers: false,
	database: 'sys',
	synchronize: false,
	logging: false,
	entities: ['node_modules/entities/*.js'],
};

export default async function createDatabase(dbName = 'easy-paghe-test') {
  testConnection.database = dbName;
	return await UnitOfWorkFactory.createAsync(testConnection);
}
