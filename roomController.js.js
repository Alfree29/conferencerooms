const Room = require('../models/Room');

// Получить все конференц-залы
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll();
        res.json({
            success: true,
            data: rooms,
            count: rooms.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении списка залов',
            error: error.message
        });
    }
};

// Получить конференц-зал по ID
exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Конференц-зал не найден'
            });
        }
        res.json({
            success: true,
            data: room
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении зала',
            error: error.message
        });
    }
};

// Создать новый конференц-зал
exports.createRoom = async (req, res) => {
    try {
        const roomData = req.body;
        
        // Валидация обязательных полей
        if (!roomData.title || !roomData.location || !roomData.price) {
            return res.status(400).json({
                success: false,
                message: 'Необходимо заполнить все обязательные поля'
            });
        }

        const newRoom = await Room.create(roomData);
        res.status(201).json({
            success: true,
            message: 'Конференц-зал успешно создан',
            data: newRoom
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при создании зала',
            error: error.message
        });
    }
};

// Обновить конференц-зал
exports.updateRoom = async (req, res) => {
    try {
        const roomId = req.params.id;
        const roomData = req.body;

        const updatedRoom = await Room.update(roomId, roomData);
        if (!updatedRoom) {
            return res.status(404).json({
                success: false,
                message: 'Конференц-зал не найден'
            });
        }

        res.json({
            success: true,
            message: 'Конференц-зал успешно обновлен',
            data: updatedRoom
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при обновлении зала',
            error: error.message
        });
    }
};

// Удалить конференц-зал
exports.deleteRoom = async (req, res) => {
    try {
        const roomId = req.params.id;
        const deletedRoom = await Room.delete(roomId);
        
        if (!deletedRoom) {
            return res.status(404).json({
                success: false,
                message: 'Конференц-зал не найден'
            });
        }

        res.json({
            success: true,
            message: 'Конференц-зал успешно удален',
            data: deletedRoom
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при удалении зала',
            error: error.message
        });
    }
};

// Поиск конференц-залов
exports.searchRooms = async (req, res) => {
    try {
        const { city, type, capacity, date } = req.query;
        let rooms = await Room.findAll();

        // Фильтрация по городу
        if (city) {
            rooms = rooms.filter(room => room.city === city);
        }

        // Фильтрация по типу
        if (type) {
            rooms = rooms.filter(room => room.type === type);
        }

        // Фильтрация по вместимости
        if (capacity) {
            const capacityNum = parseInt(capacity);
            rooms = rooms.filter(room => room.capacityMax >= capacityNum);
        }

        // Фильтрация по дате (здесь должна быть проверка доступности)
        if (date) {
            // Временная реализация - случайная доступность
            rooms = rooms.filter(() => Math.random() > 0.3);
        }

        res.json({
            success: true,
            data: rooms,
            count: rooms.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при поиске залов',
            error: error.message
        });
    }
};