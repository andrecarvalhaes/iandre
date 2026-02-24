/**
 * Serviço de Mensagens (Chat)
 * By Lucas - Data Layer
 */

const MessageService = {
    // Carregar mensagens de um agente
    async getByAgent(agentId, limit = 50) {
        try {
            const { data, error } = await window.SupabaseClient
                .from('mensagens')
                .select('*')
                .eq('agente_id', agentId)
                .order('criado_em', { ascending: true })
                .limit(limit);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
            return [];
        }
    },

    // Enviar mensagem do usuário
    async sendUserMessage(agentId, conteudo) {
        try {
            const user = (await window.SupabaseClient.auth.getUser()).data.user;

            const { data, error } = await window.SupabaseClient
                .from('mensagens')
                .insert([{
                    agente_id: agentId,
                    tipo_remetente: 'usuario',
                    remetente_id: user.id,
                    conteudo: conteudo,
                    tipo_conteudo: 'texto'
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            return null;
        }
    },

    // Simular resposta do agente (mock - será substituído por IA real)
    async sendAgentMessage(agentId, conteudo) {
        try {
            const { data, error } = await window.SupabaseClient
                .from('mensagens')
                .insert([{
                    agente_id: agentId,
                    tipo_remetente: 'agente',
                    remetente_id: null,
                    conteudo: conteudo,
                    tipo_conteudo: 'texto'
                }])
                .select()
                .single();

            if (error) throw error;

            // Incrementar contador de mensagens do agente
            await window.SupabaseClient.rpc('increment_agent_messages', {
                agent_id: agentId
            });

            return data;
        } catch (error) {
            console.error('Erro ao enviar resposta do agente:', error);
            return null;
        }
    },

    // Escutar novas mensagens em tempo real
    subscribe(agentId, callback) {
        return window.SupabaseClient
            .channel(`mensagens-${agentId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'mensagens',
                filter: `agente_id=eq.${agentId}`
            }, callback)
            .subscribe();
    }
};

window.MessageService = MessageService;
