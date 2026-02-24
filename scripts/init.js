/**
 * Script de Inicialização
 * Garante que tudo está carregado na ordem correta
 * By Lucas - System Initialization
 */

(function() {
    // Aguardar Supabase CDN carregar
    function waitForSupabase(callback, maxAttempts = 50) {
        let attempts = 0;

        function check() {
            attempts++;

            if (typeof window.supabase !== 'undefined') {
                console.log('✅ Supabase CDN carregado');
                callback();
            } else if (attempts < maxAttempts) {
                console.log(`⏳ Aguardando Supabase... (${attempts}/${maxAttempts})`);
                setTimeout(check, 100);
            } else {
                console.error('❌ Timeout: Supabase CDN não carregou');
                showError('Erro ao carregar Supabase. Recarregue a página.');
            }
        }

        check();
    }

    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            waitForSupabase(initializeApp);
        });
    } else {
        waitForSupabase(initializeApp);
    }

    function initializeApp() {
        // Verificar se o config do Supabase rodou
        if (!window.SupabaseClient) {
            console.error('❌ SupabaseClient não inicializado');
            showError('Erro de configuração. Recarregue a página.');
            return;
        }

        console.log('✅ Sistema inicializado com sucesso');
        console.log('📦 Serviços disponíveis:', {
            auth: !!window.AuthService,
            agents: !!window.AgentService,
            tasks: !!window.TaskService,
            messages: !!window.MessageService,
            metrics: !!window.MetricsService
        });

        // Disparar evento de sistema pronto
        window.dispatchEvent(new Event('iandre:ready'));
    }

    function showError(message) {
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: #fee2e2;
                padding: 2rem;
            ">
                <div style="
                    background: white;
                    padding: 2rem;
                    border-radius: 1rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    max-width: 500px;
                    text-align: center;
                ">
                    <h2 style="color: #dc2626; margin-bottom: 1rem;">⚠️ Erro</h2>
                    <p style="color: #6b7280; margin-bottom: 1.5rem;">${message}</p>
                    <button
                        onclick="window.location.reload()"
                        style="
                            padding: 0.75rem 1.5rem;
                            background: #2563eb;
                            color: white;
                            border: none;
                            border-radius: 0.5rem;
                            cursor: pointer;
                            font-size: 1rem;
                        "
                    >
                        Recarregar Página
                    </button>
                </div>
            </div>
        `;
    }
})();
