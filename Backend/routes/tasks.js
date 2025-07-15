const express = require('express');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/project/:projectId', createTask);
router.get('/project/:projectId', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;