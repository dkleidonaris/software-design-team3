const router = require('express').Router();
const {
  createDailyLog,
  getAllDailyLogs,
  getDailyLogsByUser,
  getDailyLogById,
  updateDailyLog,
  deleteDailyLog
} = require('../controllers/dailyLogController');

router.post('/', createDailyLog);                //create
router.get('/', getAllDailyLogs);                //read all
router.get('/user/:userId', getDailyLogsByUser); //read by user
router.get('/:id', getDailyLogById);             //read one by log ID
router.put('/:id', updateDailyLog);              //update
router.delete('/:id', deleteDailyLog);           //delete

module.exports = router;
