import express from 'express';
import isAuthenticated from '../auth/isAuthenticated';
import { UnitOfWorkFactory } from '../database/unitOfWorkFactory';
import { UserManager } from '../managers/userManager';

const router = express.Router();

router.use((req, res, next) => {
  if (isAuthenticated(req)) next();
  else res.sendStatus(401);
});

router.get('/:id', async function(req, res) {
  const database = await UnitOfWorkFactory.createAsync();
  const userManager = new UserManager(database);

  const user = await userManager.getByIdAsync(req.params.id);
  await database.close();
  res.send(user);
});
router.post('/', async function(req, res) {
  const database = await UnitOfWorkFactory.createAsync();
  const userManager = new UserManager(database);

  try {
    await userManager.addAsync(req.body);
    res.sendStatus(201);
  } catch (err) {
    res.status = 400;
    res.send(err);
  } finally {
    await database.close();
  }
});
router.put('/:id', function(req, res, next) {});
router.delete('/:id', function(req, res, next) {});

export default router;
