// Временное хранилище данных
let bookings = [];
let bookingIdCounter = 1;

class Booking {
    // Получить все бронирования
    static async findAll() {
        return bookings;
    }

    // Найти бронирование по ID
    static async findById(id) {
        return bookings.find(booking => booking.id === parseInt(id));
    }

    // Найти бронирования пользователя
    static async findByUserId(userId) {
        return bookings.filter(booking => booking.userId === parseInt(userId));
    }

    // Найти бронирования комнаты
    static async findByRoomId(roomId) {
        return bookings.filter(booking => booking.roomId === parseInt(roomId));
    }

    // Создать новое бронирование
    static async create(bookingData) {
        const newBooking = {
            id: bookingIdCounter++,
            ...bookingData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        bookings.push(newBooking);
        return newBooking;
    }

    // Обновить бронирование
    static async update(id, bookingData) {
        const bookingIndex = bookings.findIndex(booking => booking.id === parseInt(id));
        if (bookingIndex === -1) {
            return null;
        }

        bookings[bookingIndex] = {
            ...bookings[bookingIndex],
            ...bookingData,
            updatedAt: new Date()
        };

        return bookings[bookingIndex];
    }

    // Удалить бронирование
    static async delete(id) {
        const bookingIndex = bookings.findIndex(booking => booking.id === parseInt(id));
        if (bookingIndex === -1) {
            return null;
        }

        const deletedBooking = bookings.splice(bookingIndex, 1)[0];
        return deletedBooking;
    }

    // Проверить доступность комнаты на дату
    static async checkAvailability(roomId, date) {
        const existingBooking = bookings.find(booking => 
            booking.roomId === parseInt(roomId) && 
            booking.date === date && 
            booking.status !== 'cancelled'
        );
        
        return !existingBooking;
    }

    // Получить статистику бронирований
    static async getStats() {
        const totalBookings = bookings.length;
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
        
        const totalRevenue = bookings
            .filter(b => b.status === 'confirmed')
            .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

        return {
            totalBookings,
            confirmedBookings,
            pendingBookings,
            cancelledBookings,
            totalRevenue
        };
    }

    // Получить бронирования по статусу
    static async findByStatus(status) {
        return bookings.filter(booking => booking.status === status);
    }

    // Получить последние бронирования
    static async findRecent(limit = 10) {
        return bookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
    }
}

module.exports = Booking;