const Booking = require('../models/Booking');
const Room = require('../models/Room');

// Получить все бронирования
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        res.json({
            success: true,
            data: bookings,
            count: bookings.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении списка бронирований',
            error: error.message
        });
    }
};

// Получить бронирования пользователя
exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookings = await Booking.findByUserId(userId);
        
        res.json({
            success: true,
            data: bookings,
            count: bookings.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении бронирований пользователя',
            error: error.message
        });
    }
};

// Создать новое бронирование
exports.createBooking = async (req, res) => {
    try {
        const bookingData = req.body;
        
        // Валидация обязательных полей
        if (!bookingData.userId || !bookingData.roomId || !bookingData.date || !bookingData.hours) {
            return res.status(400).json({
                success: false,
                message: 'Необходимо заполнить все обязательные поля'
            });
        }

        // Проверяем существование комнаты
        const room = await Room.findById(bookingData.roomId);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Конференц-зал не найден'
            });
        }

        // Проверяем доступность даты
        const isAvailable = await Booking.checkAvailability(bookingData.roomId, bookingData.date);
        if (!isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Конференц-зал уже забронирован на эту дату'
            });
        }

        // Рассчитываем стоимость
        const totalPrice = room.price * (bookingData.hours / 2);
        bookingData.totalPrice = totalPrice;
        bookingData.status = 'confirmed';
        bookingData.bookingNumber = 'CONF-' + Math.floor(100000 + Math.random() * 900000);

        const newBooking = await Booking.create(bookingData);
        
        res.status(201).json({
            success: true,
            message: 'Бронирование успешно создано',
            data: newBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при создании бронирования',
            error: error.message
        });
    }
};

// Обновить бронирование
exports.updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const bookingData = req.body;

        const updatedBooking = await Booking.update(bookingId, bookingData);
        if (!updatedBooking) {
            return res.status(404).json({
                success: false,
                message: 'Бронирование не найдено'
            });
        }

        res.json({
            success: true,
            message: 'Бронирование успешно обновлено',
            data: updatedBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при обновлении бронирования',
            error: error.message
        });
    }
};

// Отменить бронирование
exports.cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const updatedBooking = await Booking.update(bookingId, { status: 'cancelled' });
        
        if (!updatedBooking) {
            return res.status(404).json({
                success: false,
                message: 'Бронирование не найдено'
            });
        }

        res.json({
            success: true,
            message: 'Бронирование успешно отменено',
            data: updatedBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при отмене бронирования',
            error: error.message
        });
    }
};

// Удалить бронирование
exports.deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const deletedBooking = await Booking.delete(bookingId);
        
        if (!deletedBooking) {
            return res.status(404).json({
                success: false,
                message: 'Бронирование не найдено'
            });
        }

        res.json({
            success: true,
            message: 'Бронирование успешно удалено',
            data: deletedBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при удалении бронирования',
            error: error.message
        });
    }
};

// Получить статистику бронирований
exports.getBookingStats = async (req, res) => {
    try {
        const stats = await Booking.getStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении статистики',
            error: error.message
        });
    }
};
