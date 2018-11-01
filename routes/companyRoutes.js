import express from 'express';
import isAuthenticated from '../auth/isAuthenticated';
import { CompanyManager } from '../managers/companyManager';

const router = express.Router();

router.use((req, res, next) => {
  if (isAuthenticated(req)) next();
  else res.sendStatus(401);
});

router.get('/:id', async function(req, res) {
  const companyManager = new CompanyManager();

  const company = await companyManager.getByIdAsync(req.params.id);
  res.send(company);
});
router.get('/:id/employees', async function(req, res) {
  const companyManager = new CompanyManager();

  const emlpoyees = await companyManager.getEmployeesAsync(req.params.id);
  res.send(employees);
});
router.post('/', async function(req, res) {
  const companyManager = new CompanyManager();

  try {
    await companyManager.addAsync(req.body);
    res.sendStatus(201);
  } catch (err) {
    res.status = 400;
    res.send(err);
  }
});
router.put('/:id', async function(req, res) {
  const companyManager = new CompanyManager();

  try {
    await companyManager.updateAsync(req.params.id, req.body);
    res.sendStatus(200);
  } catch (err) {
    res.status = 400;
    res.send(err);
  }
});
router.delete('/:id', async function(req, res) {
  const companyManager = new CompanyManager();

  try {
    await companyManager.deleteAsync(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status = 400;
    res.send(err);
  }
});

export default router;
