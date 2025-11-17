// Временное хранилище данных
let users = [
    {
        id: 1,
        name: 'Администратор',
        email: 'admin@conference.kz',
        password: '$2a$10$8K1p/a0dRTlB0ZQ1Q1q1E.9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q', // admin123
        phone: '+7 777 123 45 67',
        company: 'Конференц-залы',
        position: 'Администратор',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

let userIdCounter = 2;

class User {
    // Получить всех пользователей
    static async findAll() {
        return users;
    }

    // Найти пользователя по ID
    static async findById(id) {
        return users.find(user => user.id === parseInt(id));
    }

    // Найти пользователя по email
    static async findByEmail(email) {
        return users.find(user => user.email === email);
    }

    // Создать нового пользователя
    static async create(userData) {
        const newUser = {
            id: userIdCounter++,
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        users.push(newUser);
        return newUser;
    }

    // Обновить пользователя
    static async update(id, userData) {
        const userIndex = users.findIndex(user => user.id === parseInt(id));
        if (userIndex === -1) {
            return null;
        }

        users[userIndex] = {
            ...users[userIndex],
            ...userData,
            updatedAt: new Date()
        };

        return users[userIndex];
    }

    // Удалить пользователя
    static async delete(id) {
        const userIndex = users.findIndex(user => user.id === parseInt(id));
        if (userIndex === -1) {
            return null;
        }

        const deletedUser = users.splice(userIndex, 1)[0];
        return deletedUser;
    }

    // Проверить, является ли пользователь администратором
    static async isAdmin(userId) {
        const user = await this.findById(userId);
        return user ? user.isAdmin : false;
    }

    // Поиск пользователей по критериям
    static async search(criteria) {
        let filteredUsers = [...users];

        if (criteria.name) {
            filteredUsers = filteredUsers.filter(user => 
                user.name.toLowerCase().includes(criteria.name.toLowerCase())
            );
        }

        if (criteria.email) {
            filteredUsers = filteredUsers.filter(user => 
                user.email.toLowerCase().includes(criteria.email.toLowerCase())
            );
        }

        if (criteria.company) {
            filteredUsers = filteredUsers.filter(user => 
                user.company && user.company.toLowerCase().includes(criteria.company.toLowerCase())
            );
        }

        return filteredUsers;
    }

    // Получить статистику пользователей
    static async getStats() {
        const totalUsers = users.length;
        const adminUsers = users.filter(user => user.isAdmin).length;
        const regularUsers = totalUsers - adminUsers;

        return {
            totalUsers,
            adminUsers,
            regularUsers
        };
    }
}

module.exports = User;