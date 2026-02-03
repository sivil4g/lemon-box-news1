document.addEventListener('DOMContentLoaded', function() {
    console.log('🍋 Lemon Box News загружен!');
    
    // Мобильное меню
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
    }
    
    // Анимация при скролле для карточек новостей
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками новостей
    document.querySelectorAll('.news-card').forEach(card => {
        observer.observe(card);
    });
    
    // Анимация опроса при загрузке
    const pollBars = document.querySelectorAll('.poll-bar');
    setTimeout(() => {
        pollBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 300);
        });
    }, 500);
    
    // Анимация лимонов
    function animateLemons() {
        const lemons = document.querySelectorAll('.lemon');
        lemons.forEach((lemon, index) => {
            setTimeout(() => {
                lemon.style.transform = `translateY(-20px) scale(1.1)`;
                setTimeout(() => {
                    lemon.style.transform = `translateY(0) scale(1)`;
                }, 500);
            }, index * 300);
        });
        
        // Повторяем анимацию каждые 5 секунд
        setTimeout(animateLemons, 5000);
    }
    
    // Запускаем анимацию лимонов если они есть
    if (document.querySelector('.lemon')) {
        setTimeout(animateLemons, 1000);
    }
    
    // Эффект наведения на кнопку скачивания
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.3) rotate(10deg)';
            }
        });
        
        downloadBtn.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    }
    
    // Эффект наведения на быстрый доступ
    document.querySelectorAll('.quick-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.3) rotate(10deg)';
                icon.style.color = 'var(--lemon-yellow)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.color = 'var(--lemon-green)';
            }
        });
    });
    
    // Добавление текущего года в футере
    const yearElements = document.querySelectorAll('footer p');
    yearElements.forEach(element => {
        if (element.textContent.includes('2024')) {
            element.innerHTML = element.innerHTML.replace('2024', new Date().getFullYear());
        }
    });
    
    // Сообщение в консоль
    console.log('%c🍋 Lemon Box News v7.0', 
        'color: #FFE600; font-size: 16px; font-weight: bold;');
    console.log('%cТолько обновления и лидеры!', 
        'color: #A3E635; font-size: 12px;');
});