const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Временная конфигурация для работы с памятью
        // В реальном приложении заменить на подключение к MongoDB
        console.log('Используется временное хранилище данных в памяти');
        
        // Пример конфигурации для MongoDB:
        /*
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/conference-rooms', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        */
        
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

// Функции для работы с временным хранилищем
const memoryStorage = {
    rooms: require('../models/Room'),
    bookings: require('../models/Booking'),
    users: require('../models/User')
};

module.exports = { connectDB, memoryStorage };
