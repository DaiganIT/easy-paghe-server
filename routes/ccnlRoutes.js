import express from 'express';
import url from 'url';
import isAuthenticated from '../auth/isAuthenticated';
import { CCNLManager } from '../managers/ccnlManager';

const router = express.Router();

router.use((req, res, next) => {
  if (isAuthenticated(req)) next();
  else res.sendStatus(401);
});

/**
 * gets a list of ccnls from the database.
 * @param {string} filter Text search string.
 * @param {number} page Page number.
 * @param {number} pageLimit Number of element per page.
 */
router.get('/', async function(req, res) {
  const ccnlManager = new CCNLManager(req.user);
  const query = url.parse(req.url, true).query || {};

  const withSalaries = query.withSalaries === 'true';

  const ccnls = await ccnlManager.getAsync(withSalaries, query.filter, query.page, query.pageLimit);
  res.send(ccnls);
});
// router.get('/:id', async function(req, res) {
//   const hireManager = new HireManager(req.user);

//   const company = await personManager.getByIdAsync(req.params.id);
//   res.send(company);
// });
// router.post('/', async function(req, res) {
//   const hireManager = new HireManager(req.user);

//   try {
//     const person = await personManager.addAsync(req.body);
//     res.status(200).send(person);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });
// router.put('/:id', async function(req, res) {
//   const hireManager = new HireManager(req.user);

//   try {
//     const person = await personManager.updateAsync(req.params.id, req.body);
//     res.status(200).send(person);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });
// router.delete('/:id', async function(req, res) {
//   const hireManager = new HireManager(req.user);

//   try {
//     await personManager.deleteAsync(req.params.id);
//     res.sendStatus(204);
//   } catch (err) {
//     res.status = 400;
//     res.send(err);
//   }
// });

export default router;
