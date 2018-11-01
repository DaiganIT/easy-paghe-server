import express from 'express';
import isAuthenticated from '../auth/isAuthenticated';
import { UserManager } from '../managers/userManager';

const router = express.Router();

router.use((req, res, next) => {
  if (isAuthenticated(req)) next();
  else res.sendStatus(401);
});

router.get('/:id', async function(req, res) {
  const user = await userManager.getByIdAsync(req.params.id);
  res.send(user);
});
router.post('/', async function(req, res) {
  const userManager = new UserManager();

  try {
    await userManager.addAsync(req.body);
    res.sendStatus(201);
  } catch (err) {
    res.status = 400;
    res.send(err);
  }
});
router.put('/:code/activate', async function(req, res) {
  const userManager = new UserManager();

  try {
    await userManager.activateUserAsync(req.params.code);
    res.sendStatus(200);
  } catch (err) {
    res.status = 400;
    res.send(err);
  }
});
router.put('/:id/resend', async function(req, res) {
  const userManager = new UserManager();

  try {
    await userManager.resendActivationAsync(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    res.status = 400;
    res.send(err);
  }
});
router.put('/:id', function(req, res, next) {});
router.delete('/:id', function(req, res, next) {});

export default router;
