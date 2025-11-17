// Функция выполнения поиска
function performSearch() {
    const cityInput = document.querySelector('#cityDropdown + .search-input');
    const typeInput = document.querySelector('#typeDropdown + .search-input');
    const dateInput = document.getElementById('dateInput');
    const guestsInput = document.querySelector('#guestsDropdown + .search-input');
    
    const city = cityInput.value;
    const type = typeInput.value;
    const date = dateInput.value;
    const guests = guestsInput.value;
    
    console.log('Поиск с параметрами:', { city, type, date, guests });
    
    // Сбрасываем пагинацию
    currentPage = 1;
    
    // Фильтрация залов по критериям
    filteredRooms = conferenceRoomsDB.filter(room => {
        // Фильтр по городу
        if (city && city !== "Выберите город" && room.city !== city) {
            return false;
        }
        
        // Фильтр по типу зала
        if (type && type !== "Выберите тип" && room.type !== type) {
            return false;
        }
        
        // Фильтр по количеству гостей
        if (guests && guests !== "Выберите количество") {
            const guestsRange = guests.split('-');
            let minGuests, maxGuests;
            
            if (guestsRange.length === 2) {
                minGuests = parseInt(guestsRange[0]);
                maxGuests = parseInt(guestsRange[1]);
            } else if (guests.includes('+')) {
                minGuests = parseInt(guests);
                maxGuests = Infinity;
            }
            
            if (minGuests && room.capacityMax < minGuests) {
                return false;
            }
            if (maxGuests && room.capacityMax > maxGuests) {
                return false;
            }
        }
        
        // Фильтр по дате (в реальном приложении здесь была бы проверка доступности)
        if (date) {
            // Простая имитация проверки доступности - случайным образом
            const isAvailable = Math.random() > 0.3;
            if (!isAvailable) {
                return false;
            }
        }
        
        return true;
    });
    
    console.log('Найдено залов:', filteredRooms.length);
    
    // Обновляем отображение карточек
    renderFilteredCards();
    
    // Показываем сообщение о результате поиска
    if (filteredRooms.length === 0) {
        alert('По вашему запросу ничего не найдено. Попробуйте изменить критерии поиска.');
    } else {
        // Убираем alert для лучшего UX
        // alert(`Найдено ${filteredRooms.length} конференц-залов по вашему запросу`);
    }
}

// Инициализация выпадающих списков поиска
function initSearchDropdowns() {
    const searchItems = document.querySelectorAll('.search-item');
    
    searchItems.forEach(item => {
        const input = item.querySelector('.search-input');
        const dropdown = item.querySelector('.search-dropdown');
        
        if (input && dropdown) {
            input.addEventListener('click', function() {
                // Закрываем все другие dropdown
                document.querySelectorAll('.search-dropdown').forEach(d => {
                    if (d !== dropdown) d.classList.remove('active');
                });
                dropdown.classList.toggle('active');
            });
            
            // Обработчики для элементов dropdown
            dropdown.querySelectorAll('.dropdown-item').forEach(dropdownItem => {
                dropdownItem.addEventListener('click', function() {
                    input.value = this.getAttribute('data-value');
                    dropdown.classList.remove('active');
                    console.log('Выбрано значение:', input.value);
                });
            });
        }
    });
    
    // Закрытие dropdown при клике вне их
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-item')) {
            document.querySelectorAll('.search-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}