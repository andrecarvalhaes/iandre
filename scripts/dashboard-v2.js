/**
 * i.Andre - Dashboard Controller V2
 * Integração com Supabase
 * By Anna (UX) + Lucas (Backend Integration)
 */

// === ESTADO DA APLICAÇÃO ===
const AppState = {
    agents: [],
    tasks: [],
    metrics: {},
    subscriptions: []
};

// === UTILITÁRIOS ===
const Utils = {
    formatTimeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`;
        if (hours > 0) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `há ${minutes}min`;
        return 'agora mesmo';
    },

    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        // TODO: Implementar toast notifications
    },

    statusMap: {
        'ocioso': 'idle',
        'ativo': 'active',
        'ocupado': 'active',
        'offline': 'idle'
    },

    taskStatusMap: {
        'fila': 'queued',
        'em_andamento': 'in-progress',
        'atencao': 'attention',
        'concluida': 'completed',
        'cancelada': 'cancelled'
    }
};

// === MODAL CONTROLLER ===
const Modal = {
    element: document.getElementById('modal'),
    title: document.getElementById('modal-title'),
    body: document.getElementById('modal-body'),
    closeBtn: document.getElementById('modal-close'),

    init() {
        this.closeBtn?.addEventListener('click', () => this.hide());
        this.element?.addEventListener('click', (e) => {
            if (e.target === this.element) this.hide();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.element?.style.display !== 'none') {
                this.hide();
            }
        });
    },

    show(title, content) {
        if (!this.element) return;

        this.title.textContent = title;
        this.body.innerHTML = content;
        this.element.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    },

    hide() {
        if (!this.element) return;

        this.element.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// === DATA LOADING ===
const DataLoader = {
    async loadAll() {
        try {
            Utils.showNotification('Carregando dados...', 'info');

            // Carregar em paralelo
            const [agents, tasks, metrics] = await Promise.all([
                window.AgentService.getAll(),
                window.TaskService.getAll(),
                window.MetricsService.getWorkspaceMetrics()
            ]);

            AppState.agents = agents;
            AppState.tasks = tasks;
            AppState.metrics = metrics;

            UI.renderAll();

            Utils.showNotification('Dados carregados!', 'success');
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            Utils.showNotification('Erro ao carregar dados', 'error');
        }
    },

    setupRealtime() {
        // Escutar mudanças em agentes
        const agentsSub = window.AgentService.subscribe((payload) => {
            console.log('Mudança em agentes:', payload);
            DataLoader.loadAll();
        });

        // Escutar mudanças em tarefas
        const tasksSub = window.TaskService.subscribe((payload) => {
            console.log('Mudança em tarefas:', payload);
            DataLoader.loadAll();
        });

        AppState.subscriptions.push(agentsSub, tasksSub);
    }
};

// === UI RENDERING ===
const UI = {
    renderAll() {
        this.renderMetrics();
        this.renderAgents();
        this.renderTasks();
    },

    renderMetrics() {
        const { completed, attention, queued } = AppState.metrics;

        // Atualizar valores
        document.querySelector('.metric-success .metric-value').textContent = completed || 0;
        document.querySelector('.metric-warning .metric-value').textContent = attention || 0;
        document.querySelector('.metric-info .metric-value').textContent = queued || 0;

        // TODO: Calcular trending real
    },

    renderAgents() {
        const grid = document.getElementById('agents-grid');
        if (!grid) return;

        grid.innerHTML = AppState.agents.map(agent => `
            <div class="agent-card ${Utils.statusMap[agent.status]}" data-agent-id="${agent.id}">
                <div class="agent-avatar">${agent.avatar}</div>
                <h3 class="agent-name">${agent.nome}</h3>
                <div class="agent-status ${Utils.statusMap[agent.status]}">
                    <span class="status-dot"></span>
                    <span class="status-text">${agent.status === 'ativo' ? 'Ativo' : 'Ocioso'}</span>
                </div>
                <div class="agent-activity">
                    <p class="activity-text">"${agent.atividade_atual || 'Aguardando tarefa'}"</p>
                </div>
                <button class="agent-action-btn">💬 Chat</button>
            </div>
        `).join('');

        // Adicionar eventos
        grid.querySelectorAll('.agent-action-btn').forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const agent = AppState.agents[index];
                EventHandlers.openChat(agent);
            });
        });
    },

    renderTasks() {
        const list = document.getElementById('tasks-list');
        if (!list) return;

        const activeTasks = AppState.tasks.filter(t =>
            ['fila', 'em_andamento', 'atencao'].includes(t.status)
        );

        if (activeTasks.length === 0) {
            list.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 2rem;">Nenhuma tarefa em andamento</p>';
            return;
        }

        list.innerHTML = activeTasks.map(task => `
            <div class="task-card ${Utils.taskStatusMap[task.status]}">
                <div class="task-header">
                    <span class="task-icon">${task.status === 'atencao' ? '⚠️' : '⏳'}</span>
                    <h3 class="task-title">${task.titulo}</h3>
                </div>
                <div class="task-meta">
                    <span class="task-agent">Atribuída a: <strong>${task.agente?.nome || 'Sem agente'}</strong></span>
                    <span class="task-time">Criada ${Utils.formatTimeAgo(task.criado_em)}</span>
                </div>
                <button class="task-details-btn" data-task-id="${task.id}">Ver detalhes</button>
            </div>
        `).join('');

        // Adicionar eventos
        list.querySelectorAll('.task-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = btn.dataset.taskId;
                const task = AppState.tasks.find(t => t.id === taskId);
                if (task) EventHandlers.handleTaskDetails(task);
            });
        });
    }
};

// === EVENT HANDLERS ===
const EventHandlers = {
    // Nova Tarefa
    handleNewTask() {
        const content = `
            <form id="new-task-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">
                        Título da Tarefa
                    </label>
                    <input
                        type="text"
                        id="task-title"
                        placeholder="Ex: Criar relatório de vendas"
                        style="width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 1rem;"
                        required
                    />
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">
                        Atribuir a
                    </label>
                    <select
                        id="task-agent"
                        style="width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 1rem;"
                    >
                        ${AppState.agents.map(agent =>
                            `<option value="${agent.id}">${agent.avatar} ${agent.nome}</option>`
                        ).join('')}
                    </select>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">
                        Descrição (opcional)
                    </label>
                    <textarea
                        id="task-description"
                        rows="4"
                        placeholder="Descreva os detalhes da tarefa..."
                        style="width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 1rem; resize: vertical;"
                    ></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top: 0.5rem;">
                    Criar Tarefa
                </button>
            </form>
        `;

        Modal.show('Nova Tarefa', content);

        setTimeout(() => {
            const form = document.getElementById('new-task-form');
            form?.addEventListener('submit', async (e) => {
                e.preventDefault();
                const titulo = document.getElementById('task-title').value;
                const agenteId = document.getElementById('task-agent').value;
                const descricao = document.getElementById('task-description').value;

                // Criar tarefa via service
                const task = await window.TaskService.create({
                    titulo,
                    descricao,
                    agenteId
                });

                if (task) {
                    Utils.showNotification(`Tarefa "${titulo}" criada!`, 'success');
                    Modal.hide();
                    DataLoader.loadAll();
                } else {
                    Utils.showNotification('Erro ao criar tarefa', 'error');
                }
            });
        }, 100);
    },

    // Ver detalhes de tarefa
    handleTaskDetails(task) {
        const content = `
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div>
                    <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Descrição</h4>
                    <p style="color: #6b7280;">${task.descricao || 'Sem descrição'}</p>
                </div>
                <div>
                    <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Status</h4>
                    <span class="badge badge-info">${task.status}</span>
                </div>
                <div>
                    <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Ações</h4>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary" onclick="alert('Em desenvolvimento')">Pausar</button>
                        <button class="btn btn-secondary" onclick="alert('Em desenvolvimento')">Reatribuir</button>
                        <button class="btn btn-primary" onclick="alert('Em desenvolvimento')">Concluir</button>
                    </div>
                </div>
            </div>
        `;

        Modal.show(task.titulo, content);
    },

    // Abrir Chat
    openChat(agent) {
        const content = `
            <div id="chat-container" style="display: flex; flex-direction: column; height: 60vh;">
                <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 1rem; background: #f9fafb; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <p style="color: #9ca3af; text-align: center;">Carregando mensagens...</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <input
                        type="text"
                        id="chat-input"
                        placeholder="Digite sua mensagem..."
                        style="flex: 1; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 1rem;"
                    />
                    <button class="btn btn-primary" id="chat-send">Enviar</button>
                </div>
            </div>
        `;

        Modal.show(`💬 Chat com ${agent.nome}`, content);

        // Carregar mensagens
        setTimeout(async () => {
            const messages = await window.MessageService.getByAgent(agent.id);
            renderMessages(messages);

            // Setup chat
            setupChat(agent);
        }, 100);
    },

    // Configurações
    handleSettings() {
        const content = `
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div>
                    <h4 style="margin-bottom: 0.5rem; font-weight: 600;">Preferências Gerais</h4>
                    <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <input type="checkbox" checked />
                        Notificações de tarefas concluídas
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <input type="checkbox" checked />
                        Alertas de tarefas que precisam atenção
                    </label>
                </div>
                <div>
                    <h4 style="margin-bottom: 0.5rem; font-weight: 600;">Sobre</h4>
                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.5;">
                        i.Andre v2.0.0<br>
                        Sistema de Gerenciamento de Agentes AI<br>
                        Powered by Supabase + Claude
                    </p>
                </div>
                <button class="btn btn-primary" onclick="document.getElementById('modal-close').click();">
                    Salvar Configurações
                </button>
            </div>
        `;

        Modal.show('Configurações', content);
    }
};

// === CHAT FUNCTIONS ===
function renderMessages(messages) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    if (messages.length === 0) {
        container.innerHTML = '<p style="color: #9ca3af; text-align: center;">Nenhuma mensagem ainda. Comece a conversa!</p>';
        return;
    }

    container.innerHTML = messages.map(msg => {
        const isUser = msg.tipo_remetente === 'usuario';
        return `
            <div style="display: flex; justify-content: ${isUser ? 'flex-end' : 'flex-start'}; margin-bottom: 1rem;">
                <div style="max-width: 70%; padding: 0.75rem; border-radius: 0.5rem; background: ${isUser ? '#2563eb' : '#ffffff'}; color: ${isUser ? '#ffffff' : '#1f2937'}; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                    ${msg.conteudo}
                    <div style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.25rem;">
                        ${Utils.formatTimeAgo(msg.criado_em)}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function setupChat(agent) {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');

    const sendMessage = async () => {
        const content = input.value.trim();
        if (!content) return;

        input.value = '';
        input.disabled = true;
        sendBtn.disabled = true;
        sendBtn.textContent = '💭 Pensando...';

        try {
            // Enviar mensagem do usuário
            await window.MessageService.sendUserMessage(agent.id, content);

            // Carregar histórico de mensagens
            const history = await window.MessageService.getByAgent(agent.id);

            // Obter resposta da IA (real ou mock)
            const response = await window.AIService.sendMessage(agent.slug, content, history);

            // Enviar resposta do agente
            await window.MessageService.sendAgentMessage(agent.id, response);

            // Recarregar mensagens
            const messages = await window.MessageService.getByAgent(agent.id);
            renderMessages(messages);

        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            alert('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            input.disabled = false;
            sendBtn.disabled = false;
            sendBtn.textContent = 'Enviar';
            input.focus();
        }
    };

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 i.Andre Dashboard V2 inicializado');

    // Verificar autenticação
    const isAuth = await window.AuthService.requireAuth();
    if (!isAuth) return;

    // Mostrar informações do usuário
    const user = await window.AuthService.getCurrentUser();
    if (user) {
        const userInfo = document.getElementById('user-info');
        if (userInfo) {
            userInfo.textContent = user.email;
        }
    }

    // Inicializar modal
    Modal.init();

    // Carregar dados
    await DataLoader.loadAll();

    // Setup realtime
    DataLoader.setupRealtime();

    // Event listeners
    document.getElementById('btn-new-task')?.addEventListener('click', EventHandlers.handleNewTask);
    document.getElementById('btn-settings')?.addEventListener('click', EventHandlers.handleSettings);
    document.getElementById('btn-logout')?.addEventListener('click', async () => {
        if (confirm('Deseja realmente sair?')) {
            await window.AuthService.signOut();
        }
    });

    // Animação de entrada
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
});

// Exportar para uso global
window.iAndre = {
    state: AppState,
    modal: Modal,
    handlers: EventHandlers,
    utils: Utils,
    reload: () => DataLoader.loadAll()
};
