const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Получаем токен из заголовка Authorization
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Доступ запрещен. Токен не предоставлен.'
            });
        }

        // Проверяем токен
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Находим пользователя по ID из токена
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Токен недействителен. Пользователь не найден.'
            });
        }

        // Добавляем информацию о пользователе в запрос
        req.user = {
            userId: user.id,
            email: user.email,
            isAdmin: user.isAdmin
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Недействительный токен.'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Срок действия токена истек.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Ошибка аутентификации.',
            error: error.message
        });
    }
};

module.exports = auth;