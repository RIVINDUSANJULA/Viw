import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Every route in this file requires the user to be logged in
router.use(requireAuth); 

router.get('/:tenantId', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;