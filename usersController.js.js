const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Регистрация пользователя
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, company, position } = req.body;

        // Валидация обязательных полей
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Необходимо заполнить все обязательные поля'
            });
        }

        // Проверяем, существует ли пользователь
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Пользователь с таким email уже существует'
            });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            name,
            email,
            password: hashedPassword,
            phone: phone || '',
            company: company || '',
            position: position || '',
            isAdmin: false
        };

        const newUser = await User.create(userData);

        // Создаем JWT токен
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Убираем пароль из ответа
        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            success: true,
            message: 'Пользователь успешно зарегистрирован',
            data: {
                user: userWithoutPassword,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при регистрации пользователя',
            error: error.message
        });
    }
};

// Вход пользователя
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Валидация обязательных полей
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Необходимо заполнить email и пароль'
            });
        }

        // Ищем пользователя
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Неверный email или пароль'
            });
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Неверный email или пароль'
            });
        }

        // Создаем JWT токен
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Убираем пароль из ответа
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Вход выполнен успешно',
            data: {
                user: userWithoutPassword,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при входе в систему',
            error: error.message
        });
    }
};

// Получить профиль пользователя
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        // Убираем пароль из ответа
        const { password, ...userWithoutPassword } = user;

        res.json({
            success: true,
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении профиля',
            error: error.message
        });
    }
};

// Обновить профиль пользователя
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const updateData = req.body;

        // Не позволяем изменять пароль через этот endpoint
        if (updateData.password) {
            delete updateData.password;
        }

        const updatedUser = await User.update(userId, updateData);
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        // Убираем пароль из ответа
        const { password, ...userWithoutPassword } = updatedUser;

        res.json({
            success: true,
            message: 'Профиль успешно обновлен',
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при обновлении профиля',
            error: error.message
        });
    }
};

// Получить всех пользователей (только для администраторов)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        
        // Убираем пароли из ответа
        const usersWithoutPasswords = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.json({
            success: true,
            data: usersWithoutPasswords,
            count: users.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении списка пользователей',
            error: error.message
        });
    }
};

// Удалить пользователя (только для администраторов)
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.delete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        res.json({
            success: true,
            message: 'Пользователь успешно удален'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при удалении пользователя',
            error: error.message
        });
    }
};