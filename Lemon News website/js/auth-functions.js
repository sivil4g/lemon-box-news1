// auth-functions.js - ЕДИНЫЙ модуль работы с авторизацией
const SUPABASE_URL = 'https://wwygjddrxvofhwrlahpj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3eWdqZGRyeHZvZmh3cmxhaHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODc4NzMsImV4cCI6MjA4NTQ2Mzg3M30.fcxQSSDdlWEV6UgjRYhHFCSlaML1UaLIDpiwDqh9_Jg';

// Создаем клиент Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const authFunctions = {
    // Проверка текущего пользователя
    async getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        if (!userData) return null;
        
        try {
            return JSON.parse(userData);
        } catch {
            localStorage.removeItem('currentUser');
            return null;
        }
    },
    
    // Регистрация
    async register(email, password, username) {
        try {
            // Проверяем, не занят ли email
            const { data: existingEmail } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();
                
            if (existingEmail) {
                return { success: false, error: 'Этот email уже используется' };
            }
            
            // Проверяем, не занят ли никнейм
            const { data: existingUsername } = await supabase
                .from('users')
                .select('id')
                .eq('username', username)
                .single();
                
            if (existingUsername) {
                return { success: false, error: 'Этот никнейм уже занят' };
            }
            
            // Создаем хеш пароля (в реальном проекте - на сервере!)
            const passwordHash = btoa(encodeURIComponent(password));
            
            // Вставляем пользователя
            const { data: user, error } = await supabase
                .from('users')
                .insert([{
                    username: username,
                    email: email,
                    password_hash: passwordHash,
                    score: 100,
                    level: 1,
                    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();
                
            if (error) throw error;
            
            // Сохраняем в localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                username: user.username,
                email: user.email,
                score: user.score,
                level: user.level,
                avatar: user.avatar_url
            }));
            
            return { success: true, user };
            
        } catch (error) {
            console.error('Register error:', error);
            return { 
                success: false, 
                error: error.message || 'Ошибка при регистрации' 
            };
        }
    },
    
    // Вход
    async login(email, password) {
        try {
            // Ищем пользователя по email
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();
                
            if (error || !user) {
                return { success: false, error: 'Пользователь не найден' };
            }
            
            // Проверяем пароль (сравниваем хеши)
            const passwordHash = btoa(encodeURIComponent(password));
            if (passwordHash !== user.password_hash) {
                return { success: false, error: 'Неверный пароль' };
            }
            
            // Сохраняем в localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                username: user.username,
                email: user.email,
                score: user.score,
                level: user.level,
                avatar: user.avatar_url
            }));
            
            return { success: true, user };
            
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error.message || 'Ошибка при входе' 
            };
        }
    },
    
    // Выход
    async logout() {
        localStorage.removeItem('currentUser');
        return { success: true };
    },
    
    // Обновить данные пользователя
    async updateUserProfile(userId, updates) {
        try {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();
                
            if (error) throw error;
            
            // Обновляем localStorage
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            localStorage.setItem('currentUser', JSON.stringify({
                ...currentUser,
                ...updates
            }));
            
            return { success: true, user: data };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// Делаем доступным глобально
window.authFunctions = authFunctions;