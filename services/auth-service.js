/**
 * Serviço de Autenticação
 * By Lucas - Auth Layer
 */

const AuthService = {
    // Verificar se está autenticado
    async isAuthenticated() {
        try {
            const { data: { session } } = await window.SupabaseClient.auth.getSession();
            return session !== null;
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            return false;
        }
    },

    // Obter usuário atual
    async getCurrentUser() {
        try {
            const { data: { user }, error } = await window.SupabaseClient.auth.getUser();
            if (error) throw error;
            return user;
        } catch (error) {
            console.error('Erro ao obter usuário:', error);
            return null;
        }
    },

    // Obter sessão atual
    async getSession() {
        try {
            const { data: { session }, error } = await window.SupabaseClient.auth.getSession();
            if (error) throw error;
            return session;
        } catch (error) {
            console.error('Erro ao obter sessão:', error);
            return null;
        }
    },

    // Login
    async signIn(email, password) {
        try {
            const { data, error } = await window.SupabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, error: error.message };
        }
    },

    // Logout
    async signOut() {
        try {
            const { error } = await window.SupabaseClient.auth.signOut();
            if (error) throw error;

            // Redirecionar para login
            window.location.href = 'auth.html';

            return { success: true };
        } catch (error) {
            console.error('Erro no logout:', error);
            return { success: false, error: error.message };
        }
    },

    // Escutar mudanças de autenticação
    onAuthStateChange(callback) {
        return window.SupabaseClient.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session);
            callback(event, session);
        });
    },

    // Proteger rota (redirecionar se não autenticado)
    async requireAuth() {
        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
            window.location.href = 'auth.html';
            return false;
        }
        return true;
    }
};

window.AuthService = AuthService;
