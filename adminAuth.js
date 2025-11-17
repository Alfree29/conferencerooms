const adminAuth = (req, res, next) => {
    try {
        // Проверяем, является ли пользователь администратором
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Доступ запрещен. Требуются права администратора.'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка проверки прав администратора.',
            error: error.message
        });
    }
};

module.exports = adminAuth;
