// forum.js - базовая загрузка форума
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🍋 Forum loaded');
    
    // Проверяем авторизацию
    const user = await authFunctions.getCurrentUser();
    console.log('Current user:', user);
    
    // Загружаем статистику форума
    await loadForumStats();
    
    // Загружаем категории
    await loadForumCategories();
});

async function loadForumStats() {
    try {
        const { data: users, error: usersError } = await supabaseClient
            .from('users')
            .select('count', { count: 'exact', head: true });
            
        const { data: topics, error: topicsError } = await supabaseClient
            .from('forum_topics')
            .select('count', { count: 'exact', head: true });
            
        // Обновляем статистику на странице
        if (!usersError && users !== null) {
            document.getElementById('userCount').textContent = users;
        }
        
        if (!topicsError && topics !== null) {
            document.getElementById('topicCount').textContent = topics;
        }
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadForumCategories() {
    const categoriesContainer = document.querySelector('.forum-categories');
    
    try {
        const { data: categories, error } = await supabaseClient
            .from('forum_categories')
            .select('*')
            .order('position', { ascending: true });
            
        if (error) throw error;
        
        if (categories.length === 0) {
            categoriesContainer.innerHTML = `
                <div class="no-categories">
                    <i class="fas fa-comments"></i>
                    <h3>Категории пока не созданы</h3>
                    <p>Администратор скоро добавит разделы форума</p>
                </div>
            `;
            return;
        }
        
        let categoriesHTML = '';
        categories.forEach(category => {
            categoriesHTML += `
                <div class="category-card">
                    <div class="category-icon">
                        <i class="${category.icon || 'fas fa-comments'}"></i>
                    </div>
                    <div class="category-content">
                        <h3>${category.name}</h3>
                        <p>${category.description || 'Обсуждение игровых тем'}</p>
                        <div class="category-stats">
                            <span><i class="fas fa-comment"></i> Тем: 0</span>
                            <span><i class="fas fa-reply"></i> Сообщений: 0</span>
                        </div>
                    </div>
                    <div class="category-actions">
                        <a href="category.html?id=${category.id}" class="btn-small">
                            <i class="fas fa-eye"></i> Перейти
                        </a>
                    </div>
                </div>
            `;
        });
        
        categoriesContainer.innerHTML = categoriesHTML;
        
    } catch (error) {
        console.error('Error loading categories:', error);
        categoriesContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ошибка загрузки категорий</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}