import 'babel-polyfill';
import { UnitOfWorkFactory } from 'Database/unitOfWorkFactory';
import { CompanyManager } from 'Managers/companyManager';
import { Customer } from 'Entities/customer';

const testConnection = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",
  supportBigNumbers: false,
  database: "easy-paghe-test",
  synchronize: false,
  logging: true,
  entities: ["node_modules/entities/*.js"]
};

describe('Can Create a Company', function () {
  let testCustomer;
  let testCompany;

  this.timeout(60000);

  // before('GIVEN I have a database', async function () {
  //   let db = await UnitOfWorkFactory.createAsync(testConnection);
  //   try {
  //     await db.query('DROP SCHEMA `easy-paghe-test`');
  //   } catch (err) { }
  //   await db.query('CREATE SCHEMA `easy-paghe-test`');
  //   await db.close();

  //   testConnection.database = 'easy-paghe-test';
  //   db = await UnitOfWorkFactory.createAsync(testConnection);
  //   await db.synchronize();
  //   await db.close();
  // });

  before('GIVEN I have a customer', async function () {
    const db = await UnitOfWorkFactory.createAsync(testConnection);

    testCustomer = new Customer();
    testCustomer.name = 'Test Customer';

    testCustomer = await db.manager.save(testCustomer);
    await db.close();
  });

  before('GIVEN I have a company dto with only the name', function () {
    testCompany = {
      name: 'Test company'
    };
  });

  before('WHEN I use the manager to create the company', async function () {
    const db = await UnitOfWorkFactory.createAsync(testConnection);
    const companyManager = new CompanyManager(testCustomer);

    await companyManager.addAsync(testCompany);
    await db.close();
  });

  it('THEN the company is added', async function () {
    const db = await UnitOfWorkFactory.createAsync(testConnection);
    const companies = await db.getRepository(Company)
      .find();

    console.log(companies.length);
  });
});