// auth.js - Обработка авторизации на всех страницах
document.addEventListener('DOMContentLoaded', async function() {
    // Проверяем авторизацию
    const user = await authFunctions.getCurrentUser();
    
    if (user) {
        // Пользователь авторизован
        updateUIForLoggedInUser(user);
    } else {
        // Пользователь не авторизован
        updateUIForGuest();
    }
    
    // Обработка форм (если они есть на странице)
    attachFormHandlers();
});

// Прикрепляем обработчики форм
function attachFormHandlers() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Выход
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Функция регистрации
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = await authFunctions.register(email, password, username);
    
    if (result.success) {
        alert('Регистрация успешна!');
        window.location.href = 'forum.html';
    } else {
        alert('Ошибка: ' + result.error);
    }
}

// Функция входа
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = await authFunctions.login(email, password);
    
    if (result.success) {
        alert('Вход выполнен!');
        window.location.href = 'forum.html';
    } else {
        alert('Ошибка: ' + result.error);
    }
}

// Функция выхода
async function handleLogout() {
    const result = await authFunctions.logout();
    
    if (result.success) {
        window.location.href = 'index.html';
    }
}

// Обновление интерфейса для авторизованного пользователя
async function updateUIForLoggedInUser(user) {
    // Скрываем кнопки входа/регистрации
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const userMenu = document.getElementById('userMenu');
    
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    
    // Обновляем имя в меню
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = user.username;
    }
    
    // Обновляем аватар
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar && user.avatar) {
        userAvatar.src = user.avatar;
    }
}

// Обновление интерфейса для гостя
function updateUIForGuest() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) userMenu.style.display = 'none';
}