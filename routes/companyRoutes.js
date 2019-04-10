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
  const companyManager = new CompanyManager(req.user);
  const query = url.parse(req.url, true).query || {};

  const companies = await companyManager.getAsync(query.filter, query.page, query.pageLimit);
  res.send(companies);
});
router.get('/:companyId', async function(req, res) {
  const companyManager = new CompanyManager(req.user);

  const company = await companyManager.getByIdAsync(req.params.companyId, true);
  res.send(company);
});
router.get('/:companyId/bases/:companyBaseId/employees', async function(req, res) {
  const companyManager = new CompanyManager(req.user);
  const query = url.parse(req.url, true).query || {};

  const company = await companyManager.getBaseEmployeesAsync(req.params.companyBaseId, query.filter, query.page, query.pageLimit);
  res.send(company);
});
router.get('/:companyId/employees', async function(req, res) {
  const companyManager = new CompanyManager(req.user);
  const query = url.parse(req.url, true).query || {};

  const employees = await companyManager.getAllEmployeesAsync(req.params.companyId, query.filter, query.page, query.pageLimit);
  res.send(employees);
});
router.post('/', async function(req, res) {
  const companyManager = new CompanyManager(req.user);

  try {
    const company = await companyManager.addAsync(req.body);
    res.status(201).send(company);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.put('/:companyId', async function(req, res) {
  const companyManager = new CompanyManager(req.user);

  try {
    const company = await companyManager.updateAsync(req.params.companyId, req.body);
    res.status(200).send(company);
  } catch (err) {
    res.status = 400;
    res.send(err);
  }
});
router.post('/:companyId/bases/:companyBaseId/employees', async function(req, res) {
  const companyManager = new CompanyManager(req.user);

  const employees = await companyManager.addEmployeeAsync(req.params.companyBaseId, req.body.employeeId);
  res.send(employees);
});
router.delete('/:companyId/bases/:companyBaseId/employees/:employeeId', async function(req, res) {
  const companyManager = new CompanyManager(req.user);

  await companyManager.removeEmployeeAsync(req.params.companyBaseId, req.params.employeeId);
  res.status(200).send();
});
router.delete('/:companyId', async function(req, res) {
  const companyManager = new CompanyManager(req.user);
  const query = url.parse(req.url, true).query || {};

  try {
    await companyManager.deleteAsync(req.params.companyId, query.employees);
    res.status(204).send();
  } catch (err) {
    res.status = 400;
    res.send(err);
  }
});
router.delete('/:companyId/bases/:companyBaseId', async function(req, res) {
  const companyManager = new CompanyManager(req.user);
  const query = url.parse(req.url, true).query || {};

  try {
    await companyManager.deleteBaseAsync(req.params.companyBaseId, query.employees);
    res.status(204).send();
  } catch (err) {
    res.status = 400;
    res.send(err);
  }
});

export default router;
