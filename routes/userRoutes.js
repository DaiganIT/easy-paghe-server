import express from 'express';
import isAuthenticated from '../auth/isAuthenticated';
import uowFactory from '../database/unitOfWorkFactory';
import UserManager from '../managers/userManager';

const router = express.Router();

router.use((req, res, next) => {
  if(isAuthenticated(req))
    next();
  else
    res.send(401);
});

router.get('{id}', function(req, res) {
  const database = await uowFactory.createAsync();
  const userManager = new UserManager(database);

  const user = await userManager.getByIdAsync(req.params.id);
  res.send(user);
});
router.post('', function(req, res, next) {
});
router.put('{id}', function(req, res, next) {
});
router.delete('{id}', function(req, res, next) {
});

export default router;
