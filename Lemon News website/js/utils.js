// ===== УТИЛИТЫ И ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

// Форматирование даты
window.formatDate = function(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Менее минуты назад
    if (diff < 60000) {
        return 'только что';
    }
    
    // Менее часа назад
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} ${declension(minutes, ['минуту', 'минуты', 'минут'])} назад`;
    }
    
    // Сегодня
    if (date.toDateString() === now.toDateString()) {
        return `сегодня в ${date.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })}`;
    }
    
    // Вчера
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return `вчера в ${date.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })}`;
    }
    
    // Более 2 дней назад
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
};

// Склонение слов
window.declension = function(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[
        number % 100 > 4 && number % 100 < 20 
            ? 2 
            : cases[number % 10 < 5 ? number % 10 : 5]
    ];
};

// Валидация email
window.validateEmail = function(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Валидация пароля
window.validatePassword = function(password) {
    const errors = [];
    
    if (password.length < 6) {
        errors.push('Пароль должен быть не менее 6 символов');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Добавьте хотя бы одну заглавную букву');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Добавьте хотя бы одну цифру');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        errors.push('Добавьте хотя бы один специальный символ');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

// Генерация случайного цвета
window.generateRandomColor = function() {
    const colors = [
        '#FFD700', '#7CB342', '#FF9800', '#2196F3', 
        '#9C27B0', '#F44336', '#00BCD4', '#4CAF50'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

// Форматирование чисел (1,000)
window.formatNumber = function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Копирование в буфер обмена
window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Скопировано в буфер обмена', 'success');
    }).catch(err => {
        console.error('Ошибка копирования:', err);
        showNotification('Не удалось скопировать', 'error');
    });
};

// Задержка выполнения
window.delay = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Дебаунс (задержка выполнения функции)
window.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Случайный элемент из массива
window.getRandomElement = function(array) {
    return array[Math.floor(Math.random() * array.length)];
};

// Проверка мобильного устройства
window.isMobile = function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Сохранение в localStorage с обработкой ошибок
window.safeLocalStorage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Ошибка сохранения в localStorage:', e);
            return false;
        }
    },
    
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Ошибка чтения из localStorage:', e);
            return null;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Ошибка удаления из localStorage:', e);
            return false;
        }
    }
};

// Создание аватарки по имени
window.createAvatar = function(name, size = 64) {
    const colors = ['#FFD700', '#7CB342', '#FF9800', '#2196F3', '#9C27B0'];
    const color = colors[name.length % colors.length];
    const initials = name.substring(0, 2).toUpperCase();
    
    return `
        <div style="
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${size / 2.5}px;
        ">
            ${initials}
        </div>
    `;
};