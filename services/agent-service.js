/**
 * Serviço de Agentes
 * By Lucas - Data Layer
 */

const AgentService = {
    // Carregar todos os agentes do workspace atual
    async getAll() {
        try {
            const { data, error } = await window.SupabaseClient
                .from('agentes')
                .select('*')
                .order('nome', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao carregar agentes:', error);
            return [];
        }
    },

    // Buscar agente por slug
    async getBySlug(slug) {
        try {
            const { data, error } = await window.SupabaseClient
                .from('agentes')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao buscar agente:', error);
            return null;
        }
    },

    // Atualizar status do agente
    async updateStatus(agentId, status, atividadeAtual) {
        try {
            const { data, error } = await window.SupabaseClient
                .from('agentes')
                .update({
                    status: status,
                    atividade_atual: atividadeAtual
                })
                .eq('id', agentId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            return null;
        }
    },

    // Escutar mudanças em tempo real
    subscribe(callback) {
        return window.SupabaseClient
            .channel('agentes-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'agentes'
            }, callback)
            .subscribe();
    }
};

window.AgentService = AgentService;
