const router = require('express').Router();
const { authMiddleware,
  authorizePersonalUserActionMiddleware
} = require('../middleware/authMiddleware');

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

router.post('/', createUser);      //create
router.get('/', authMiddleware, getUsers);         //read all
router.get('/:userId', authMiddleware, authorizePersonalUserActionMiddleware, getUserById);   //read one by user ID
router.put('/:userId', authMiddleware, authorizePersonalUserActionMiddleware, updateUser);    //update
router.delete('/:userId', authMiddleware, authorizePersonalUserActionMiddleware, deleteUser); //delete

module.exports = router;
