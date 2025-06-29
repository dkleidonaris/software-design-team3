const router = require('express').Router();
const { authMiddleware,
  authorizePersonalUserActionMiddleware
} = require('../middleware/authMiddleware');

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateCurrentUserDietPlan,
  getCurrentUser
} = require('../controllers/userController');

router.post('/', createUser);
router.get('/', authMiddleware, getUsers);

// ✅ Specific routes first
router.get('/current', authMiddleware, getCurrentUser);
router.put('/current/dietPlan', authMiddleware, updateCurrentUserDietPlan);

// 🔻 Dynamic routes after
router.get('/:userId', authMiddleware, authorizePersonalUserActionMiddleware, getUserById);
router.put('/:userId', authMiddleware, authorizePersonalUserActionMiddleware, updateUser);
router.delete('/:userId', authMiddleware, authorizePersonalUserActionMiddleware, deleteUser);


module.exports = router;
