const router = require('express').Router();
const {
  createMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal
} = require('../controllers/mealController');

router.post('/', createMeal);      //create
router.get('/', getMeals);         //read all
router.get('/:id', getMealById);   //read one by meal ID
router.put('/:id', updateMeal);    //update
router.delete('/:id', deleteMeal); //delete

module.exports = router;
