// Загрузка данных бронирований
function loadBookingsData() {
    const bookings = JSON.parse(localStorage.getItem('conferenceBookings')) || [];
    const users = JSON.parse(localStorage.getItem('conferenceUsers')) || [];
    const conferenceRoomsDB = JSON.parse(localStorage.getItem('conferenceRoomsDB')) || [];
    
    const tbody = document.querySelector('#bookingsTable tbody');
    tbody.innerHTML = '';
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Нет данных о бронированиях</td></tr>';
        return;
    }
    
    bookings.forEach(booking => {
        const user = users.find(u => u.id === booking.userId);
        const room = conferenceRoomsDB.find(r => r.id === booking.roomId);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${booking.bookingNumber || 'N/A'}</td>
            <td>${user ? user.name : 'Неизвестный пользователь'}</td>
            <td>${room ? room.title : 'Неизвестный зал'}</td>
            <td>${booking.date || 'N/A'}</td>
            <td>${booking.hours || 'N/A'}</td>
            <td>${booking.totalPrice ? booking.totalPrice.toLocaleString() + ' ₸' : 'N/A'}</td>
            <td><span class="status ${getStatusClass(booking.status)}">${getStatusText(booking.status)}</span></td>
            <td>
                <button class="btn btn-secondary" onclick="editBooking(${booking.id})">Изменить</button>
                <button class="btn btn-danger" onclick="deleteBooking(${booking.id})">Удалить</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Загрузка данных конференц-залов
function loadRoomsData() {
    const conferenceRoomsDB = JSON.parse(localStorage.getItem('conferenceRoomsDB')) || [];
    
    const tbody = document.querySelector('#roomsTable tbody');
    tbody.innerHTML = '';
    
    if (conferenceRoomsDB.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Нет данных о конференц-залах</td></tr>';
        return;
    }
    
    conferenceRoomsDB.forEach(room => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${room.id}</td>
            <td>${room.title}</td>
            <td>${room.city}</td>
            <td>${room.type}</td>
            <td>${room.capacity}</td>
            <td>${room.price ? room.price.toLocaleString() + ' ₸' : 'N/A'}</td>
            <td>${room.rating || 'N/A'}</td>
            <td>
                <button class="btn btn-secondary" onclick="editRoom(${room.id})">Изменить</button>
                <button class="btn btn-danger" onclick="deleteRoom(${room.id})">Удалить</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Загрузка данных пользователей
function loadUsersData() {
    const users = JSON.parse(localStorage.getItem('conferenceUsers')) || [];
    
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Нет данных о пользователях</td></tr>';
        return;
    }
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || '-'}</td>
            <td>${user.company || '-'}</td>
            <td>${user.isAdmin ? 'Администратор' : 'Пользователь'}</td>
            <td>
                <button class="btn btn-secondary" onclick="editUser(${user.id})">Изменить</button>
                <button class="btn btn-danger" onclick="deleteUser(${user.id})">Удалить</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}