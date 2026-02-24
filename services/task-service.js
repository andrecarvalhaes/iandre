/**
 * Serviço de Tarefas
 * By Lucas - Data Layer
 */

const TaskService = {
    // Carregar todas as tarefas
    async getAll(filters = {}) {
        try {
            let query = window.SupabaseClient
                .from('tarefas')
                .select(`
                    *,
                    agente:agentes(id, nome, avatar, slug)
                `)
                .order('criado_em', { ascending: false });

            // Filtros opcionais
            if (filters.status) {
                query = query.eq('status', filters.status);
            }
            if (filters.agentId) {
                query = query.eq('agente_id', filters.agentId);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            return [];
        }
    },

    // Criar nova tarefa
    async create(taskData) {
        try {
            const { data, error } = await window.SupabaseClient
                .from('tarefas')
                .insert([{
                    titulo: taskData.titulo,
                    descricao: taskData.descricao,
                    agente_id: taskData.agenteId,
                    status: 'fila',
                    prioridade: taskData.prioridade || 0,
                    criado_por: (await window.SupabaseClient.auth.getUser()).data.user.id
                }])
                .select(`
                    *,
                    agente:agentes(id, nome, avatar, slug)
                `)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            return null;
        }
    },

    // Atualizar status da tarefa
    async updateStatus(taskId, status) {
        try {
            const updates = { status };

            if (status === 'em_andamento' && !updates.iniciada_em) {
                updates.iniciada_em = new Date().toISOString();
            }
            if (status === 'concluida') {
                updates.concluida_em = new Date().toISOString();
            }

            const { data, error } = await window.SupabaseClient
                .from('tarefas')
                .update(updates)
                .eq('id', taskId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            return null;
        }
    },

    // Escutar mudanças em tempo real
    subscribe(callback) {
        return window.SupabaseClient
            .channel('tarefas-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'tarefas'
            }, callback)
            .subscribe();
    }
};

window.TaskService = TaskService;
