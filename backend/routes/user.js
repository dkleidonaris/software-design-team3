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
router.get('/:id', authMiddleware, authorizePersonalUserActionMiddleware, getUserById);   //read one by user ID
router.put('/:id', authMiddleware, authorizePersonalUserActionMiddleware, updateUser);    //update
router.delete('/:id', authMiddleware, authorizePersonalUserActionMiddleware, deleteUser); //delete

module.exports = router;
