        // ============================================
        // РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ В SUPABASE
        // ============================================
        
        // Конфигурация Supabase
        const SUPABASE_URL = 'https://wwygjddrxvofhwrlahpj.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3eWdqZGRyeHZvZmh3cmxhaHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODc4NzMsImV4cCI6MjA4NTQ2Mzg3M30.fcxQSSDdlWEV6UgjRYhHFCSlaML1UaLIDpiwDqh9_Jg';
        
        // Создаем клиент Supabase
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        
        // Элементы DOM
        const form = document.getElementById('registerForm');
        const messageDiv = document.getElementById('message');
        const submitBtn = document.getElementById('submitBtn');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const passwordMatchSpan = document.getElementById('passwordMatch');
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');
        
        // Проверка сложности пароля
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            // Критерии сложности
            if (password.length >= 6) strength += 25;
            if (/[A-Z]/.test(password)) strength += 25;
            if (/[0-9]/.test(password)) strength += 25;
            if (/[^A-Za-z0-9]/.test(password)) strength += 25;
            
            // Обновляем индикатор
            strengthBar.style.width = strength + '%';
            
            if (strength < 50) {
                strengthBar.style.background = '#ff6b6b';
                strengthText.textContent = 'Сложность: слабый';
            } else if (strength < 75) {
                strengthBar.style.background = '#ffa94d';
                strengthText.textContent = 'Сложность: средний';
            } else {
                strengthBar.style.background = '#69db7c';
                strengthText.textContent = 'Сложность: надежный';
            }
        });
        
        // Проверка совпадения паролей
        confirmPasswordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const confirmPassword = this.value;
            
            if (confirmPassword === '') {
                passwordMatchSpan.textContent = '';
                this.classList.remove('error');
            } else if (password !== confirmPassword) {
                passwordMatchSpan.textContent = '❌ Пароли не совпадают';
                passwordMatchSpan.style.color = '#ff6b6b';
                this.classList.add('error');
            } else {
                passwordMatchSpan.textContent = '✅ Пароли совпадают';
                passwordMatchSpan.style.color = '#69db7c';
                this.classList.remove('error');
            }
        });
        
        // Обработка отправки формы
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Получаем данные из формы
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Валидация
            if (!username || !email || !password || !confirmPassword) {
                showMessage('Заполните все поля', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage('Пароль должен быть не менее 6 символов', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('Пароли не совпадают', 'error');
                return;
            }
            
            // Блокируем кнопку
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрируем...';
            submitBtn.disabled = true;
            
            try {
                // ПРОСТОЙ ХЕШ (в реальном проекте нужно хешировать на сервере!)
                // Для демо используем base64
                const passwordHash = btoa(encodeURIComponent(password));
                
                // Вставляем пользователя в базу данных
                const { data, error } = await supabase
                    .from('users')
                    .insert([
                        { 
                            username: username,
                            email: email,
                            password_hash: passwordHash,
                            score: 100,  // Стартовые очки
                            level: 1,    // Стартовый уровень
                            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
                        }
                    ])
                    .select(); // Возвращаем созданного пользователя
                
                if (error) {
                    // Обработка ошибок
                    let errorMessage = 'Ошибка регистрации';
                    
                    if (error.code === '23505') { // Ошибка уникальности
                        if (error.message.includes('username')) {
                            errorMessage = 'Этот никнейм уже занят';
                        } else if (error.message.includes('email')) {
                            errorMessage = 'Этот email уже используется';
                        }
                    } else if (error.code === '42P01') {
                        errorMessage = 'Ошибка базы данных. Таблица users не найдена.';
                    } else {
                        errorMessage = error.message;
                    }
                    
                    showMessage('❌ ' + errorMessage, 'error');
                    console.error('Supabase error:', error);
                    
                } else {
                    // Успешная регистрация
                    const user = data[0];
                    
                    showMessage(`✅ Регистрация успешна! Добро пожаловать, ${username}!`, 'success');
                    
                    // Сохраняем пользователя в localStorage
                    localStorage.setItem('currentUser', JSON.stringify({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        score: user.score,
                        level: user.level,
                        avatar: user.avatar_url
                    }));
                    
                    // Показываем информацию о пользователе
                    setTimeout(() => {
                        showMessage(
                            `🎉 Аккаунт создан!<br>` +
                            `ID: ${user.id}<br>` +
                            `Ник: ${user.username}<br>` +
                            `Очки: ${user.score}<br>` +
                            `Уровень: ${user.level}<br><br>` +
                            `Перенаправляем на главную...`,
                            'success'
                        );
                    }, 1000);
                    
                    // Через 3 секунды переходим на главную
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 3000);
                }
                
            } catch (error) {
                showMessage('❌ Неизвестная ошибка: ' + error.message, 'error');
                console.error('Catch error:', error);
                
            } finally {
                // Разблокируем кнопку
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
        
        // Функция показа сообщений
        function showMessage(text, type) {
            messageDiv.innerHTML = text;
            messageDiv.className = 'message ' + type;
            messageDiv.style.display = 'block';
            
            // Авто-скрытие ошибок через 5 секунд
            if (type === 'error') {
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 5000);
            }
        }
        
        // Проверяем, не авторизован ли уже пользователь
        document.addEventListener('DOMContentLoaded', function() {
            const currentUser = localStorage.getItem('currentUser');
            
            if (currentUser) {
                try {
                    const user = JSON.parse(currentUser);
                    showMessage(
                        `✅ Вы уже вошли как ${user.username}<br>` +
                        `<a href="index.html" style="color: #FFE600; text-decoration: none; font-weight: bold;">Перейти на главную</a>`,
                        'info'
                    );
                    
                    // Блокируем форму
                    form.style.opacity = '0.5';
                    form.style.pointerEvents = 'none';
                    submitBtn.disabled = true;
                    
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    localStorage.removeItem('currentUser');
                }
            }
        });
        
        // Простая функция для проверки подключения
        async function checkConnection() {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('count', { count: 'exact', head: true });
                
                if (error && error.code === '42P01') {
                    console.log('✅ Подключение работает, но таблица users не найдена');
                } else if (error) {
                    console.error('Ошибка подключения:', error);
                } else {
                    console.log('✅ Подключение к Supabase активно');
                }
            } catch (error) {
                console.error('Ошибка проверки подключения:', error);
            }
        }
        
        // Проверяем подключение при загрузке
        window.addEventListener('load', checkConnection);