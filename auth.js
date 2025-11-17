// Управление аутентификацией
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.setupAuthHandlers();
    }

    loadUserFromStorage() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            this.token = token;
            this.currentUser = JSON.parse(userData);
            this.updateUI();
        }
    }

    setupAuthHandlers() {
        // Обработчики для модального окна авторизации
        document.getElementById('closeAuthModal')?.addEventListener('click', () => this.hideAuthModal());
        document.getElementById('closeAuthModalBtn')?.addEventListener('click', () => this.hideAuthModal());
        document.getElementById('closeAuthModalBtn2')?.addEventListener('click', () => this.hideAuthModal());

        // Обработчики для вкладок авторизации
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchAuthTab(e.target));
        });

        // Обработчики для форм
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm')?.addEventListener('submit', (e) => this.handleRegister(e));

        // Обработчик для выхода
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // Временная реализация - проверка локальных данных
            const users = JSON.parse(localStorage.getItem('conferenceUsers')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                await this.loginSuccess(user);
            } else {
                this.showError('Неверный email или пароль!');
            }
        } catch (error) {
            this.showError('Ошибка при входе в систему');
            console.error('Login error:', error);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (password !== confirmPassword) {
            this.showError('Пароли не совпадают!');
            return;
        }

        try {
            // Временная реализация - сохранение в localStorage
            const users = JSON.parse(localStorage.getItem('conferenceUsers')) || [];
            
            if (users.find(u => u.email === email)) {
                this.showError('Пользователь с таким email уже зарегистрирован!');
                return;
            }

            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password,
                phone: '',
                company: '',
                position: '',
                isAdmin: false
            };

            users.push(newUser);
            localStorage.setItem('conferenceUsers', JSON.stringify(users));
            
            await this.loginSuccess(newUser);
        } catch (error) {
            this.showError('Ошибка при регистрации');
            console.error('Register error:', error);
        }
    }

    async loginSuccess(user) {
        this.currentUser = user;
        this.token = this.generateToken();
        
        // Сохраняем в localStorage
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        this.updateUI();
        this.hideAuthModal();
        this.showSuccess('Вход выполнен успешно!');
        
        // Обновляем глобальную переменную
        if (typeof currentUser !== 'undefined') {
            currentUser = user;
        }
        
        // Если пользователь - администратор, показываем ссылку на админ-панель
        if (user.isAdmin) {
            document.getElementById('adminLink').style.display = 'block';
            document.getElementById('mobileAdminLink').style.display = 'block';
        }
    }

    logout() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            this.currentUser = null;
            this.token = null;
            
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('currentUser');
            
            this.updateUI();
            this.showSuccess('Вы вышли из системы');
            
            // Обновляем глобальную переменную
            if (typeof currentUser !== 'undefined') {
                currentUser = null;
            }
            
            // Скрываем админ-панель
            document.getElementById('adminLink').style.display = 'none';
            document.getElementById('mobileAdminLink').style.display = 'none';
            
            // Возвращаем на главную страницу
            if (typeof showPage === 'function') {
                showPage('home');
            }
        }
    }

    updateUI() {
        const userIcon = document.getElementById('userIcon');
        if (userIcon) {
            if (this.currentUser) {
                userIcon.innerHTML = `<i class="fas fa-user-check"></i>`;
            } else {
                userIcon.innerHTML = `<i class="fas fa-user"></i>`;
            }
        }
    }

    switchAuthTab(tab) {
        const tabName = tab.getAttribute('data-tab');
        
        document.querySelectorAll('.auth-tab').forEach(t => {
            t.classList.remove('active');
        });
        tab.classList.add('active');
        
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(tabName + 'Form').classList.add('active');
    }

    showAuthModal() {
        document.getElementById('authModal').style.display = 'flex';
    }

    hideAuthModal() {
        document.getElementById('authModal').style.display = 'none';
        // Очищаем формы
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
    }

    showError(message) {
        alert(message); // В реальном приложении лучше использовать красивый toast
    }

    showSuccess(message) {
        alert(message); // В реальном приложении лучше использовать красивый toast
    }

    generateToken() {
        return 'token_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser?.isAdmin === true;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getToken() {
        return this.token;
    }
}

// Инициализация менеджера аутентификации
const authManager = new AuthManager();