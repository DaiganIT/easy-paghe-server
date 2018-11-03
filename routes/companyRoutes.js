import express from 'express';
import url from 'url';
import isAuthenticated from '../auth/isAuthenticated';
import { CompanyManager } from '../managers/companyManager';

const router = express.Router();

router.use((req, res, next) => {
  if (isAuthenticated(req)) next();
  else res.sendStatus(401);
});

/**
 * accepts
 * @param {string} filter Text search string.
 * @param {number} page Page number.
 * @param {number} pageLimit Number of element per page.
 */
router.get('/', async function(req, res) {
  const companyManager = new CompanyManager(req.user.customer);
  const query = url.parse(req.url, true).query || {};

  const companies = await companyManager.getAsync(query.filter, query.page, query.pageLimit);
  res.send(companies);
});
router.get('/:id', async function(req, res) {
  const companyManager = new CompanyManager(req.user.customer);

  const company = await companyManager.getByIdAsync(req.params.id);
  res.send(company);
});
router.get('/:id/employees', async function(req, res) {
  const companyManager = new CompanyManager(req.user.customer);
  const query = url.parse(req.url, true).query || {};

  const employees = await companyManager.getEmployeesAsync(req.params.id, query.filter, query.page, query.pageLimit);
  res.send(employees);
});
router.post('/', async function(req, res) {
  const companyManager = new CompanyManager(req.user.customer);

  try {
    await companyManager.addAsync(req.body);
    res.sendStatus(201);
  } catch (err) {
    res.status = 400;
    res.send(err);
  }
});
router.put('/:id', async function(req, res) {
  const companyManager = new CompanyManager(req.user.customer);

  try {
    await companyManager.updateAsync(req.params.id, req.body);
    res.sendStatus(200);
  } catch (err) {
    res.status = 400;
    res.send(err);
  }
});
router.put('/:id/employees/:employeeId', async function(req, res) {
  const companyManager = new CompanyManager(req.user.customer);

  const employees = await companyManager.addEmployeeAsync(req.params.id, req.params.employeeId);
  res.send(employees);
});
router.delete('/:id', async function(req, res) {
  const companyManager = new CompanyManager(req.user.customer);

  try {
    await companyManager.deleteAsync(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status = 400;
    res.send(err);
  }
});
router.delete('/:id/employees/:employeeId', async function(req, res) {
  const companyManager = new CompanyManager(req.user.customer);

  const employees = await companyManager.removeEmployeeAsync(req.params.id, req.params.employeeId);
  res.send(employees);
});

export default router;
