// supabase-config.js
if (typeof supabase === 'undefined') {
    console.error('❌ Библиотека Supabase не загружена');
} else {
    const SUPABASE_URL = 'https://wwygjddrxvofhwrlahpj.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3eWdqZGRyeHZvZmh3cmxhaHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODc4NzMsImV4cCI6MjA4NTQ2Mzg3M30.fcxQSSDdlWEV6UgjRYhHFCSlaML1UaLIDpiwDqh9_Jg';
    
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase готов к использованию');
}

window.supabase = supabase;