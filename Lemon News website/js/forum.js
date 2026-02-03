// ===== ЛОГИКА ФОРУМА =====

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    const user = window.authFunctions ? window.authFunctions.getCurrentUser() : null;
    
    // Загружаем категории форума
    loadForumCategories();
    
    // Загружаем последние темы
    loadRecentTopics();
    
    // Обновляем статистику
    updateForumStats();
    
    // Настраиваем поиск
    setupForumSearch();
    
    // Обработка кнопки выхода
    setupLogoutButton();
    
    console.log('🍋 Форум загружен');
});

// Загрузка категорий форума
async function loadForumCategories() {
    const categoriesContainer = document.getElementById('forumCategories');
    
    if (!categoriesContainer) return;
    
    try {
        // Имитация загрузки данных
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const categories = [
            {
                id: 1,
                name: 'Новости и обновления',
                description: 'Официальные анонсы, патчноты и новости разработки',
                icon: 'fas fa-newspaper',
                topics: 156,
                posts: 2457
            },
            {
                id: 2,
                name: 'Обсуждение игры',
                description: 'Геймплей, тактики, стратегии и советы по игре',
                icon: 'fas fa-gamepad',
                topics: 342,
                posts: 5891
            },
            {
                id: 3,
                name: 'Поиск команды',
                description: 'Ищете напарников или гильдию? Здесь вы найдете!',
                icon: 'fas fa-users',
                topics: 89,
                posts: 1245
            },
            {
                id: 4,
                name: 'Баги и проблемы',
                description: 'Сообщайте об ошибках и технических проблемах',
                icon: 'fas fa-bug',
                topics: 67,
                posts: 892
            },
            {
                id: 5,
                name: 'Творчество',
                description: 'Арты, видео, фан-арт и творчество сообщества',
                icon: 'fas fa-palette',
                topics: 124,
                posts: 1876
            },
            {
                id: 6,
                name: 'Оффтопик',
                description: 'Обсуждение не связанное с игрой',
                icon: 'fas fa-coffee',
                topics: 78,
                posts: 1098
            }
        ];
        
        let categoriesHTML = '';
        
        categories.forEach(category => {
            categoriesHTML += `
                <div class="category-card animate-fade">
                    <div class="category-icon">
                        <i class="${category.icon}"></i>
                    </div>
                    <div class="category-content">
                        <h3 class="category-title">${category.name}</h3>
                        <p class="category-description">${category.description}</p>
                        <div class="category-stats">
                            <div class="category-stat">
                                <i class="fas fa-comment"></i>
                                <span>Тем: ${formatNumber(category.topics)}</span>
                            </div>
                            <div class="category-stat">
                                <i class="fas fa-reply"></i>
                                <span>Сообщений: ${formatNumber(category.posts)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="category-actions">
                        <a href="category.html?id=${category.id}" class="btn-small">
                            <i class="fas fa-eye"></i> Перейти
                        </a>
                        <a href="new-topic.html?category=${category.id}" class="btn-small">
                            <i class="fas fa-plus"></i> Новая тема
                        </a>
                    </div>
                </div>
            `;
        });
        
        categoriesContainer.innerHTML = categoriesHTML;
        
    } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
        categoriesContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ошибка загрузки категорий</h3>
                <p>${error.message}</p>
                <button class="btn btn-primary mt-3" onclick="loadForumCategories()">
                    <i class="fas fa-sync-alt"></i> Попробовать снова
                </button>
            </div>
        `;
    }
}

// Загрузка последних тем
async function loadRecentTopics() {
    const topicsContainer = document.getElementById('recentTopics');
    
    if (!topicsContainer) return;
    
    try {
        // Имитация загрузки данных
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const topics = [
            {
                id: 1,
                title: 'Обновление 7.1 - что нового?',
                author: 'LemonDev',
                category: 'Новости',
                replies: 145,
                views: 2890,
                lastActivity: new Date(Date.now() - 3600000), // 1 час назад
                isPinned: true
            },
            {
                id: 2,
                title: 'Лучшие стратегии для PvP режима',
                author: 'ProGamer228',
                category: 'Обсуждение',
                replies: 89,
                views: 1567,
                lastActivity: new Date(Date.now() - 7200000), // 2 часа назад
                isPinned: false
            },
            {
                id: 3,
                title: 'Проблема с загрузкой текстур',
                author: 'NewPlayer123',
                category: 'Баги',
                replies: 23,
                views: 456,
                lastActivity: new Date(Date.now() - 14400000), // 4 часа назад
                isPinned: false
            },
            {
                id: 4,
                title: 'Ищем активных игроков в гильдию',
                author: 'GuildMaster',
                category: 'Поиск команды',
                replies: 34,
                views: 789,
                lastActivity: new Date(Date.now() - 21600000), // 6 часов назад
                isPinned: true
            },
            {
                id: 5,
                title: 'Мой фан-арт главного героя',
                author: 'ArtLover',
                category: 'Творчество',
                replies: 67,
                views: 1234,
                lastActivity: new Date(Date.now() - 28800000), // 8 часов назад
                isPinned: false
            }
        ];
        
        let topicsHTML = '';
        
        topics.forEach(topic => {
            topicsHTML += `
                <div class="topic-card ${topic.isPinned ? 'topic-pinned' : ''} animate-fade">
                    <div class="topic-icon">
                        <i class="fas fa-comment${topic.isPinned ? '-alt' : ''}"></i>
                    </div>
                    <div class="topic-content">
                        <a href="topic.html?id=${topic.id}" class="topic-title">
                            ${topic.isPinned ? '<i class="fas fa-thumbtack text-lemon"></i> ' : ''}
                            ${topic.title}
                        </a>
                        <div class="topic-meta">
                            <span class="topic-author">${topic.author}</span>
                            <span>в ${topic.category}</span>
                            <span>• ${formatDate(topic.lastActivity)}</span>
                        </div>
                    </div>
                    <div class="topic-stats">
                        <div class="topic-stat">
                            <i class="fas fa-reply"></i>
                            <span>${topic.replies}</span>
                        </div>
                        <div class="topic-stat">
                            <i class="fas fa-eye"></i>
                            <span>${formatNumber(topic.views)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        topicsContainer.innerHTML = topicsHTML;
        
    } catch (error) {
        console.error('Ошибка загрузки тем:', error);
        topicsContainer.innerHTML = `
            <div class="error-message">
                <p>Не удалось загрузить последние темы. ${error.message}</p>
            </div>
        `;
    }
}

// Обновление статистики форума
function updateForumStats() {
    // Имитация обновления статистики
    const stats = {
        users: 1247 + Math.floor(Math.random() * 10),
        topics: 856 + Math.floor(Math.random() * 5),
        posts: 12459 + Math.floor(Math.random() * 20),
        online: 187 + Math.floor(Math.random() * 15)
    };
    
    document.getElementById('userCount').textContent = formatNumber(stats.users);
    document.getElementById('topicCount').textContent = formatNumber(stats.topics);
    document.getElementById('postCount').textContent = formatNumber(stats.posts);
    document.getElementById('onlineCount').textContent = formatNumber(stats.online);
}

// Настройка поиска по форуму
function setupForumSearch() {
    const searchInput = document.getElementById('forumSearch');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!searchInput || !searchBtn) return;
    
    // Обработка клика по кнопке поиска
    searchBtn.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    // Обработка нажатия Enter в поле поиска
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
    
    // Дебаунс для поиска при вводе
    searchInput.addEventListener('input', debounce(function() {
        if (this.value.length >= 3) {
            performSearch(this.value);
        }
    }, 500));
}

// Выполнение поиска
function performSearch(query) {
    if (!query.trim()) {
        showNotification('Введите поисковый запрос', 'info');
        return;
    }
    
    showNotification(`Ищем: "${query}"`, 'info');
    
    // Здесь будет реальный поиск через API
    console.log('Поиск по форуму:', query);
    
    // Имитация поиска
    setTimeout(() => {
        showNotification(`Найдено 15 результатов по запросу "${query}"`, 'success');
    }, 1000);
}

// Настройка кнопки выхода
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            if (window.authFunctions && window.authFunctions.logout) {
                const result = await window.authFunctions.logout();
                
                if (result.success) {
                    showNotification('Вы успешно вышли из аккаунта', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                }
            } else {
                // Если authFunctions не загружены, просто очищаем localStorage
                localStorage.removeItem('currentUser');
                showNotification('Вы вышли из аккаунта', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
    }
}

// Создание новой темы (для страницы new-topic.html)
window.createNewTopic = async function(topicData) {
    try {
        // Проверяем авторизацию
        const user = window.authFunctions ? window.authFunctions.getCurrentUser() : null;
        
        if (!user) {
            showNotification('Для создания темы необходимо авторизоваться', 'error');
            return { success: false, error: 'Требуется авторизация' };
        }
        
        // Имитация создания темы
        showNotification('Создание темы...', 'info');
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showNotification('Тема успешно создана!', 'success');
        
        return {
            success: true,
            topicId: Math.floor(Math.random() * 1000) + 1000,
            message: 'Тема опубликована'
        };
        
    } catch (error) {
        showNotification('Ошибка при создании темы', 'error');
        return { success: false, error: error.message };
    }
};

// Загрузка комментариев к теме
window.loadTopicComments = async function(topicId) {
    try {
        // Имитация загрузки комментариев
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return {
            success: true,
            comments: [
                {
                    id: 1,
                    author: 'LemonDev',
                    avatar: createAvatar('LemonDev', 40),
                    content: 'Спасибо за отзыв! Мы уже работаем над исправлением этой проблемы.',
                    date: new Date(Date.now() - 3600000),
                    likes: 24
                },
                {
                    id: 2,
                    author: 'ProGamer228',
                    avatar: createAvatar('ProGamer228', 40),
                    content: 'Отличное обновление! Особенно понравились новые анимации.',
                    date: new Date(Date.now() - 7200000),
                    likes: 18
                },
                {
                    id: 3,
                    author: 'NewPlayer123',
                    avatar: createAvatar('NewPlayer123', 40),
                    content: 'А когда добавят новую локацию? Очень жду!',
                    date: new Date(Date.now() - 10800000),
                    likes: 5
                }
            ]
        };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Добавление комментария
window.addComment = async function(topicId, commentText) {
    try {
        const user = window.authFunctions ? window.authFunctions.getCurrentUser() : null;
        
        if (!user) {
            showNotification('Для комментирования необходимо авторизоваться', 'error');
            return { success: false, error: 'Требуется авторизация' };
        }
        
        if (!commentText.trim()) {
            showNotification('Введите текст комментария', 'error');
            return { success: false, error: 'Пустой комментарий' };
        }
        
        // Имитация добавления комментария
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            success: true,
            comment: {
                id: Math.floor(Math.random() * 1000) + 1000,
                author: user.username,
                avatar: createAvatar(user.username, 40),
                content: commentText,
                date: new Date(),
                likes: 0
            }
        };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Обновление статистики каждые 30 секунд
setInterval(updateForumStats, 30000);

// Экспорт функций для использования в других файлах
if (typeof module !== 'undefined') {
    module.exports = {
        loadForumCategories,
        loadRecentTopics,
        updateForumStats,
        performSearch
    };
}