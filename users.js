const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// POST /api/users/register - Регистрация пользователя (публичный маршрут)
router.post('/register', usersController.register);

// POST /api/users/login - Вход пользователя (публичный маршрут)
router.post('/login', usersController.login);

// Все следующие маршруты требуют аутентификации
router.use(auth);

// GET /api/users/profile - Получить профиль текущего пользователя
router.get('/profile', usersController.getProfile);

// PUT /api/users/profile - Обновить профиль текущего пользователя
router.put('/profile', usersController.updateProfile);

// GET /api/users - Получить всех пользователей (только для администраторов)
router.get('/', adminAuth, usersController.getAllUsers);

// DELETE /api/users/:id - Удалить пользователя (только для администраторов)
router.delete('/:id', adminAuth, usersController.deleteUser);

module.exports = router;