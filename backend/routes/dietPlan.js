const router = require('express').Router();
const {
  getDietPlans,
  getDietPlanById,
} = require('../controllers/dietPlanController');

router.get('/', getDietPlans);         //read all
router.get('/:id', getDietPlanById);   //read one by diet plan ID

module.exports = router;
