import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  list,
  get,
  create,
  update,
  remove,
} from '../controllers/stocks.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/', list);
router.get('/:farmerCode', get);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', remove);

export default router;
