        const supabase = window.supabase.createClient(
            'https://wwygjddrxvofhwrlahpj.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3eWdqZGRyeHZvZmh3cmxhaHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODc4NzMsImV4cCI6MjA4NTQ2Mzg3M30.fcxQSSDdlWEV6UgjRYhHFCSlaML1UaLIDpiwDqh9_Jg'
        );
        
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // В реальном проекте нужно сравнивать хеши паролей!
            // Здесь просто ищем пользователя с таким email и паролем
            const { data: users, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .limit(1);
            
            if (error) {
                alert('Ошибка: ' + error.message);
            } else if (users.length === 0) {
                alert('Пользователь не найден');
            } else {
                const user = users[0];
                // Проверяем пароль (в реальности нужно сравнивать хеши!)
                if (btoa(encodeURIComponent(password)) === user.password_hash) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    alert('Вход выполнен!');
                    window.location.href = 'index.html';
                } else {
                    alert('Неверный пароль');
                }
            }
        });