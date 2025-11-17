// Основной файл приложения
const API_BASE_URL = 'http://localhost:3000/api';

// Глобальные переменные
let currentPage = 1;
const roomsPerPage = 6;
let filteredRooms = [];
let currentUser = null;

// База данных конференц-залов (временная, пока нет бэкенда)
const conferenceRoomsDB = [
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
        coordinates: [43.238949, 76.889709]
    }
];

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Проверяем авторизацию
    checkAuth();
    
    // Загружаем данные
    loadRooms();
    
    // Инициализируем компоненты
    initComponents();
    
    // Устанавливаем обработчики событий
    setupEventListeners();
}

function checkAuth() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        currentUser = JSON.parse(userData);
        updateUserInterface();
    }
}

async function loadRooms() {
    try {
        // Временная реализация - используем локальные данные
        // const response = await fetch(`${API_BASE_URL}/rooms`);
        // const rooms = await response.json();
        
        filteredRooms = [...conferenceRoomsDB];
        renderCards('all');
    } catch (error) {
        console.error('Ошибка загрузки залов:', error);
        // Используем локальные данные в случае ошибки
        filteredRooms = [...conferenceRoomsDB];
        renderCards('all');
    }
}

function initComponents() {
    initDatePicker();
    initBurgerMenu();
    initSearchDropdowns();
    initTabs();
    initShowMore();
}

function setupEventListeners() {
    // Навигация
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Категории
    document.querySelectorAll('.category').forEach(category => {
        category.addEventListener('click', handleCategoryClick);
    });
    
    // Кнопка "Показать еще"
    document.getElementById('loadMoreBtn')?.addEventListener('click', loadMoreRooms);
    
    // Кнопка "Назад"
    document.querySelectorAll('.page-back').forEach(backBtn => {
        backBtn.addEventListener('click', handleBackClick);
    });
    
    // Иконка пользователя
    document.getElementById('userIcon')?.addEventListener('click', handleUserIconClick);
}

function handleNavigation(e) {
    e.preventDefault();
    const page = this.getAttribute('data-page');
    showPage(page);
    
    // Обновляем активную ссылку
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
        a.classList.remove('active');
    });
    this.classList.add('active');
    
    // Закрываем мобильное меню
    closeMobileMenu();
}

function handleCategoryClick() {
    document.querySelectorAll('.category').forEach(cat => {
        cat.classList.remove('active');
    });
    this.classList.add('active');
    
    const category = this.getAttribute('data-category');
    currentPage = 1;
    renderCards(category);
}

function handleBackClick() {
    const page = this.getAttribute('data-page');
    showPage(page);
}

function handleUserIconClick() {
    if (currentUser) {
        showPage('user-profile');
    } else {
        showAuthModal();
    }
}

function renderCards(category) {
    const cardsContainer = document.getElementById('cardsContainer');
    if (!cardsContainer) return;
    
    cardsContainer.innerHTML = '';
    currentPage = 1;
    
    filteredRooms = category === 'all' 
        ? [...conferenceRoomsDB] 
        : conferenceRoomsDB.filter(room => room.category.includes(category));
    
    renderFilteredCards();
}

function renderFilteredCards() {
    const cardsContainer = document.getElementById('cardsContainer');
    if (!cardsContainer) return;
    
    cardsContainer.innerHTML = '';
    
    const startIndex = (currentPage - 1) * roomsPerPage;
    const endIndex = startIndex + roomsPerPage;
    const roomsToShow = filteredRooms.slice(0, endIndex);
    
    if (roomsToShow.length === 0) {
        cardsContainer.innerHTML = '<p>По вашему запросу ничего не найдено. Попробуйте изменить критерии поиска.</p>';
        document.getElementById('loadMoreContainer').style.display = 'none';
        return;
    }
    
    roomsToShow.forEach(room => {
        const card = createRoomCard(room);
        cardsContainer.appendChild(card);
    });
    
    document.getElementById('loadMoreContainer').style.display = 
        endIndex >= filteredRooms.length ? 'none' : 'block';
}

function createRoomCard(room) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-room-id', room.id);
    card.innerHTML = `
        <div class="card-image" style="background-image: url('${room.image}')">
            <div class="heart">
                <i class="far fa-heart"></i>
            </div>
        </div>
        <div class="card-info">
            <div class="card-title">${room.title}</div>
            <div class="card-location">${room.location}</div>
            <div class="card-price">${room.price.toLocaleString()} Т ${room.pricePeriod}</div>
            <div class="card-rating">
                <i class="fas fa-star"></i>
                <span>${room.rating}</span>
            </div>
            <button class="view-btn">Посмотреть</button>
        </div>
    `;
    
    card.querySelector('.view-btn').addEventListener('click', () => showRoomDetail(room.id));
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.heart') && !e.target.closest('.view-btn')) {
            showRoomDetail(room.id);
        }
    });
    
    return card;
}

function loadMoreRooms() {
    currentPage++;
    renderFilteredCards();
}

function showPage(pageName) {
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById('room-detail-page')?.classList.remove('active');
    
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    if (pageName === 'user-profile' && currentUser) {
        updateUserProfile();
    }
    
    if (pageName === 'admin' && currentUser?.isAdmin) {
        loadAdminData();
    }
}

function updateUserInterface() {
    if (currentUser) {
        const userIcon = document.getElementById('userIcon');
        if (userIcon) {
            userIcon.innerHTML = `<i class="fas fa-user-check"></i>`;
        }
        
        if (currentUser.isAdmin) {
            document.getElementById('adminLink').style.display = 'block';
            document.getElementById('mobileAdminLink').style.display = 'block';
        }
    }
}

function closeMobileMenu() {
    document.getElementById('burgerMenu')?.classList.remove('active');
    document.getElementById('mobileNav')?.classList.remove('active');
}

// Вспомогательные функции
function getCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
}

function getStatusClass(status) {
    switch(status) {
        case 'confirmed': return 'status-confirmed';
        case 'pending': return 'status-pending';
        case 'cancelled': return 'status-cancelled';
        default: return '';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'confirmed': return 'Подтверждено';
        case 'pending': return 'Ожидание';
        case 'cancelled': return 'Отменено';
        default: return status;
    }
}