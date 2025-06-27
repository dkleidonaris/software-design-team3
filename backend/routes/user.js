const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

router.post('/', createUser);      //create
router.get('/', getUsers);         //read all
router.get('/:id', getUserById);   //read one by user ID
router.put('/:id', updateUser);    //update
router.delete('/:id', deleteUser); //delete

module.exports = router;
