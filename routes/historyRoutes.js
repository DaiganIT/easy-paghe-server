import express from 'express';
import url from 'url';
import isAuthenticated from '../auth/isAuthenticated';
import { HistoryManager } from '../managers/historyManager';

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
router.get('companies/{id}', async function(req, res) {
  const historyManager = new HistoryManager(req.user);
  const query = url.parse(req.url, true).query || {};

  const histories = await historyManager.getAsync('Company', req.params.companyId, query.filter, query.page, query.pageLimit);
  res.send(histories);
});

export default router;
