/**
 * Configuração do Supabase
 * By Lucas - Backend Integration
 */

// Aguardar o Supabase CDN carregar
(function initSupabase() {
    // Verificar se o Supabase já está disponível
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Supabase CDN não carregado! Verifique se o script está no HTML.');
        return;
    }

    // Credenciais do Supabase
    const SUPABASE_URL = 'https://vwzgreramlxwzmtbhchl.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3emdyZXJhbWx4d3ptdGJoY2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4ODIwNjQsImV4cCI6MjA4NzQ1ODA2NH0.KJzSChlkfYn4qCkQdB_jlh13_28j7e8IGEK2UvWuRLk';

    try {
        // Inicializar cliente Supabase
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Exportar para uso global
        window.SupabaseClient = supabase;

        console.log('✅ Supabase configurado:', SUPABASE_URL);
        console.log('✅ Cliente disponível em: window.SupabaseClient');
    } catch (error) {
        console.error('❌ Erro ao inicializar Supabase:', error);
    }
})();
