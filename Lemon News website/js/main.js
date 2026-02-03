// ===== ОСНОВНЫЕ СКРИПТЫ САЙТА =====
// Работают на ВСЕХ страницах

document.addEventListener('DOMContentLoaded', function() {
    console.log('🍋 Lemon Box News загружен!');
    
    // 1. Мобильное меню
    initMobileMenu();
    
    // 2. Анимации при скролле
    initScrollAnimations();
    
    // 3. Кнопка "Наверх"
    initBackToTop();
    
    // 4. Анимация карточек
    initCardAnimations();
    
    // 5. Проверка авторизации
    checkAuthStatus();
    
    // 6. Обновление года в футере
    updateFooterYear();
    
    // 7. Обработка активных ссылок
    highlightActiveLink();
});

// ===== МОБИЛЬНОЕ МЕНЮ =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.innerHTML = nav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Закрытие при клике вне меню
        document.addEventListener('click', (event) => {
            if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
                nav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

// ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками новостей
    document.querySelectorAll('.news-card, .stat, .category-card, .widget').forEach(element => {
        observer.observe(element);
    });
}

// ===== КНОПКА "НАВЕРХ" =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== АНИМАЦИИ КАРТОЧЕК =====
function initCardAnimations() {
    const cards = document.querySelectorAll('.news-card, .quick-link, .category-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===== ПРОВЕРКА АВТОРИЗАЦИИ =====
function checkAuthStatus() {
    const currentUser = localStorage.getItem('currentUser');
    const userMenu = document.getElementById('userMenu');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const navLoginLink = document.getElementById('navLoginLink');
    const navRegisterLink = document.getElementById('navRegisterLink');
    
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            const userNameElement = document.getElementById('userName');
            
            if (userNameElement) {
                userNameElement.textContent = user.username || 'Пользователь';
            }
            
            if (userMenu) userMenu.style.display = 'flex';
            
            // Скрываем ссылки на вход/регистрацию
            [loginLink, registerLink, navLoginLink, navRegisterLink].forEach(link => {
                if (link) link.style.display = 'none';
            });
            
        } catch (e) {
            console.error('Ошибка парсинга пользователя:', e);
            localStorage.removeItem('currentUser');
        }
    }
}

// ===== ОБНОВЛЕНИЕ ГОДА В ФУТЕРЕ =====
function updateFooterYear() {
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.footer-copyright, .footer-logo-text');
    
    yearElements.forEach(element => {
        if (element.textContent.includes('2024')) {
            element.innerHTML = element.innerHTML.replace('2024', currentYear);
        }
    });
}

// ===== ПОДСВЕТКА АКТИВНОЙ ССЫЛКИ =====
function highlightActiveLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link, .quick-nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ===== УТИЛИТЫ УВЕДОМЛЕНИЙ =====
window.showNotification = function(message, type = 'info', duration = 5000) {
    // Создаем контейнер для уведомлений если его нет
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const icon = document.createElement('i');
    icon.className = `fas ${
        type === 'success' ? 'fa-check-circle' : 
        type === 'error' ? 'fa-times-circle' : 
        'fa-info-circle'
    }`;
    
    const text = document.createElement('span');
    text.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(text);
    notificationContainer.appendChild(notification);
    
    // Автоудаление через указанное время
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
            if (notificationContainer.children.length === 0) {
                notificationContainer.remove();
            }
        }, 300);
    }, duration);
    
    // Добавляем стили для анимаций
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    return notification;
};

// ===== ПРОВЕРКА ПОДКЛЮЧЕНИЯ К СЕТИ =====
function initNetworkStatus() {
    window.addEventListener('online', function() {
        showNotification('Соединение восстановлено', 'success');
    });
    
    window.addEventListener('offline', function() {
        showNotification('Отсутствует соединение с интернетом', 'error', 0);
    });
}

// ===== ПРЕДЗАГРУЗКА ИЗОБРАЖЕНИЙ =====
function preloadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback для старых браузеров
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// ===== ЗАПУСК ВСЕХ ФУНКЦИЙ =====
document.addEventListener('DOMContentLoaded', function() {
    // Запускаем все инициализации
    initMobileMenu();
    initScrollAnimations();
    initBackToTop();
    initCardAnimations();
    checkAuthStatus();
    updateFooterYear();
    highlightActiveLink();
    initNetworkStatus();
    preloadImages();
    
    // Сообщение в консоль
    console.log('%c🍋 Lemon Box News v2.0', 
        'color: #FFD700; font-size: 16px; font-weight: bold;');
    console.log('%cДизайн обновлён и оптимизирован!', 
        'color: #7CB342; font-size: 12px;');
});