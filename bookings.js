const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Все маршруты требуют аутентификации
router.use(auth);

// GET /api/bookings - Получить все бронирования (только для администраторов)
router.get('/', adminAuth, bookingsController.getAllBookings);

// GET /api/bookings/user/:userId - Получить бронирования пользователя
router.get('/user/:userId', bookingsController.getUserBookings);

// GET /api/bookings/stats - Получить статистику бронирований (только для администраторов)
router.get('/stats', adminAuth, bookingsController.getBookingStats);

// POST /api/bookings - Создать новое бронирование
router.post('/', bookingsController.createBooking);

// PUT /api/bookings/:id - Обновить бронирование
router.put('/:id', bookingsController.updateBooking);

// PATCH /api/bookings/:id/cancel - Отменить бронирование
router.patch('/:id/cancel', bookingsController.cancelBooking);

// DELETE /api/bookings/:id - Удалить бронирование (только для администраторов)
router.delete('/:id', adminAuth, bookingsController.deleteBooking);

module.exports = router;