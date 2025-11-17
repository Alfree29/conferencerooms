// Временное хранилище данных (в реальном приложении заменить на базу данных)
let rooms = [
    {
        id: 1,
        title: "Конференц-зал 'Бизнес-центр'",
        location: "Алма-Ата, пр. Аль-Фараби, 77",
        price: 7959,
        pricePeriod: "2 часа",
        rating: "4.94",
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: ["all", "equipment", "wifi", "parking"],
        type: "Большой",
        city: "Алма-Ата",
        capacity: "до 50 человек",
        capacityMax: 50,
        description: "Просторный конференц-зал в современном бизнес-центре с панорамными окнами. Идеально подходит для проведения деловых встреч, презентаций и семинаров.",
        features: ["Проектор и экран", "Wi-Fi", "Система кондиционирования", "Флипчарт", "Парковка", "Кофе-брейк"],
        host: {
            name: "Асель",
            type: "Суперхозяин",
            experience: "5 месяцев сдает зал",
            rating: "4.9",
            reviews: "21 отзыв",
            responseRate: "100%",
            responseTime: "в течение часа"
        },
        images: [
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        ],
        coordinates: [43.238949, 76.889709],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        title: "Современный зал для переговоров",
        location: "Алма-Ата, ул. Гоголя, 135",
        price: 5669,
        pricePeriod: "2 часа",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: ["all", "equipment", "wifi"],
        type: "Малый",
        city: "Алма-Ата",
        capacity: "до 15 человек",
        capacityMax: 15,
        description: "Уютный зал для переговоров и небольших совещаний. Современный дизайн и эргономичная мебель создают комфортную атмосферу для продуктивной работы.",
        features: ["Интерактивная доска", "Wi-Fi", "Система кондиционирования", "Телевизор", "Мини-кухня"],
        host: {
            name: "Данияр",
            type: "Хозяин",
            experience: "3 месяца сдает зал",
            rating: "4.8",
            reviews: "12 отзывов",
            responseRate: "95%",
            responseTime: "в течение 2 часов"
        },
        images: [
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        ],
        coordinates: [43.250000, 76.950000],
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

class Room {
    // Получить все комнаты
    static async findAll() {
        return rooms;
    }

    // Найти комнату по ID
    static async findById(id) {
        return rooms.find(room => room.id === parseInt(id));
    }

    // Найти комнаты по городу
    static async findByCity(city) {
        return rooms.filter(room => room.city === city);
    }

    // Создать новую комнату
    static async create(roomData) {
        const newRoom = {
            id: rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1,
            ...roomData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        rooms.push(newRoom);
        return newRoom;
    }

    // Обновить комнату
    static async update(id, roomData) {
        const roomIndex = rooms.findIndex(room => room.id === parseInt(id));
        if (roomIndex === -1) {
            return null;
        }

        rooms[roomIndex] = {
            ...rooms[roomIndex],
            ...roomData,
            updatedAt: new Date()
        };

        return rooms[roomIndex];
    }

    // Удалить комнату
    static async delete(id) {
        const roomIndex = rooms.findIndex(room => room.id === parseInt(id));
        if (roomIndex === -1) {
            return null;
        }

        const deletedRoom = rooms.splice(roomIndex, 1)[0];
        return deletedRoom;
    }

    // Поиск комнат по критериям
    static async search(criteria) {
        let filteredRooms = [...rooms];

        if (criteria.city) {
            filteredRooms = filteredRooms.filter(room => room.city === criteria.city);
        }

        if (criteria.type) {
            filteredRooms = filteredRooms.filter(room => room.type === criteria.type);
        }

        if (criteria.capacity) {
            filteredRooms = filteredRooms.filter(room => room.capacityMax >= parseInt(criteria.capacity));
        }

        if (criteria.category) {
            filteredRooms = filteredRooms.filter(room => room.category.includes(criteria.category));
        }

        return filteredRooms;
    }

    // Проверить доступность комнаты на дату
    static async checkAvailability(roomId, date) {
        // Временная реализация - всегда доступно
        // В реальном приложении здесь должна быть проверка бронирований
        return true;
    }
}

module.exports = Room;