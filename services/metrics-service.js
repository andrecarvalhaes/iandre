/**
 * Serviço de Métricas
 * By Lucas - Analytics Layer
 */

const MetricsService = {
    // Carregar métricas do workspace
    async getWorkspaceMetrics() {
        try {
            // Usar a view criada pelo Nick
            const { data, error } = await window.SupabaseClient
                .from('metricas_espaco_trabalho')
                .select('*')
                .single();

            if (error) throw error;

            return {
                completed: data.tarefas_concluidas || 0,
                attention: data.tarefas_atencao || 0,
                queued: data.tarefas_fila || 0,
                totalTasks: data.total_tarefas || 0,
                totalAgents: data.total_agentes || 0,
                totalMessages: data.total_mensagens || 0
            };
        } catch (error) {
            console.error('Erro ao carregar métricas:', error);
            return {
                completed: 0,
                attention: 0,
                queued: 0,
                totalTasks: 0,
                totalAgents: 0,
                totalMessages: 0
            };
        }
    },

    // Carregar estatísticas de agentes
    async getAgentStats() {
        try {
            const { data, error } = await window.SupabaseClient
                .from('estatisticas_agentes')
                .select('*')
                .order('nome', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            return [];
        }
    },

    // Calcular trending (variação do dia)
    async getTrending() {
        try {
            // Pegar tarefas concluídas hoje
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const { data, error } = await window.SupabaseClient
                .from('tarefas')
                .select('id')
                .eq('status', 'concluida')
                .gte('concluida_em', hoje.toISOString());

            if (error) throw error;

            return {
                completedToday: data.length,
                trend: data.length > 0 ? 'positive' : 'neutral'
            };
        } catch (error) {
            console.error('Erro ao calcular trending:', error);
            return { completedToday: 0, trend: 'neutral' };
        }
    }
};

window.MetricsService = MetricsService;
