import express from 'express';
import url from 'url';
import isAuthenticated from '../auth/isAuthenticated';
import { PersonManager } from '../managers/personManager';

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
  const personManager = new PersonManager(req.user.customer);
  const query = url.parse(req.url, true).query || {};

  const companies = await personManager.getAsync(query.filter, query.page, query.pageLimit);
  res.send(companies);
});
router.get('/:id', async function(req, res) {
  const personManager = new PersonManager(req.user.customer);

  const company = await personManager.getByIdAsync(req.params.id);
  res.send(company);
});
router.post('/', async function(req, res) {
  const personManager = new PersonManager(req.user.customer);

  try {
    await personManager.addAsync(req.body);
    res.sendStatus(201);
  } catch (err) {
    res.status = 400;
    res.send(err);
  }
});
router.put('/:id', async function(req, res) {
  const personManager = new PersonManager(req.user.customer);

  try {
    await personManager.updateAsync(req.params.id, req.body);
    res.sendStatus(200);
  } catch (err) {
    res.status = 400;
    res.send(err);
  }
});
router.delete('/:id', async function(req, res) {
  const personManager = new PersonManager(req.user.customer);

  try {
    await personManager.deleteAsync(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status = 400;
    res.send(err);
  }
});

export default router;
