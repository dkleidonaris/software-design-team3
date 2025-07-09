const router = require('express').Router();
const {
  createDailyLog,
  getAllDailyLogs,
  getDailyLogs,
  getDailyLogById,
  getDailyLogByDate,
  updateDailyLog,
  deleteDailyLog
} = require('../controllers/dailyLogController');
const { authMiddleware,
  authorizePersonalUserActionMiddleware
} = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createDailyLog);
router.get('/', authMiddleware, getAllDailyLogs);
router.get('/:id', authMiddleware, getDailyLogById);
router.put('/:id', authMiddleware, updateDailyLog);
router.delete('/:id', authMiddleware, deleteDailyLog);

module.exports = router;
