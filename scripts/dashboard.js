/**
 * i.Andre - Dashboard Controller
 * Gerencia interações e estado do dashboard
 */

// === ESTADO DA APLICAÇÃO ===
const AppState = {
    agents: [
        {
            id: 'anna',
            name: 'Anna',
            avatar: '🎨',
            status: 'active',
            activity: 'Criando tela home...'
        },
        {
            id: 'assistant',
            name: 'Assistente',
            avatar: '💼',
            status: 'idle',
            activity: 'Aguardando tarefa'
        },
        {
            id: 'analyst',
            name: 'Analista',
            avatar: '📊',
            status: 'active',
            activity: 'Análise de dados...'
        },
        {
            id: 'technician',
            name: 'Técnico',
            avatar: '🔧',
            status: 'idle',
            activity: 'Aguardando tarefa'
        }
    ],
    tasks: [
        {
            id: 1,
            title: 'Criar tela home do sistema',
            agent: 'Anna',
            status: 'in-progress',
            startedAt: new Date(Date.now() - 5 * 60 * 1000) // 5 min atrás
        },
        {
            id: 2,
            title: 'Análise de dados Q1',
            agent: 'Analista',
            status: 'in-progress',
            startedAt: new Date(Date.now() - 15 * 60 * 1000) // 15 min atrás
        },
        {
            id: 3,
            title: 'Revisão de relatório mensal',
            agent: 'Assistente',
            status: 'attention',
            startedAt: new Date(Date.now() - 30 * 60 * 1000) // 30 min atrás
        }
    ],
    metrics: {
        completed: 12,
        attention: 3,
        queued: 8
    }
};

// === UTILITÁRIOS ===
const Utils = {
    formatTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`;
        if (hours > 0) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `há ${minutes}min`;
        return 'agora mesmo';
    },

    showNotification(message, type = 'info') {
        // Implementação futura: toast notifications
        console.log(`[${type.toUpperCase()}] ${message}`);
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

        // ESC para fechar
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
                            `<option value="${agent.id}">${agent.avatar} ${agent.name}</option>`
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

        // Handle form submit
        setTimeout(() => {
            const form = document.getElementById('new-task-form');
            form?.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('task-title').value;
                const agentId = document.getElementById('task-agent').value;
                const agent = AppState.agents.find(a => a.id === agentId);

                Utils.showNotification(`Tarefa "${title}" atribuída a ${agent.name}!`, 'success');
                Modal.hide();
            });
        }, 100);
    },

    // Novo Agente
    handleNewAgent() {
        const avatarOptions = ['🤖', '👨‍💼', '👩‍💻', '🧑‍🔬', '👨‍🎨', '👩‍🏫', '🧑‍⚕️', '👨‍🚀', '🦸', '🧙'];

        const content = `
            <form id="new-agent-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">
                        Nome do Agente
                    </label>
                    <input
                        type="text"
                        id="agent-name"
                        placeholder="Ex: Especialista em Marketing"
                        style="width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 1rem;"
                        required
                    />
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">
                        Avatar
                    </label>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem;">
                        ${avatarOptions.map((emoji, index) => `
                            <button
                                type="button"
                                class="avatar-option"
                                data-avatar="${emoji}"
                                style="padding: 1rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; background: white; font-size: 2rem; cursor: pointer; transition: all 0.15s;"
                                onclick="document.querySelectorAll('.avatar-option').forEach(el => el.style.borderColor = '#e5e7eb'); this.style.borderColor = '#2563eb';"
                                ${index === 0 ? 'style="border-color: #2563eb;"' : ''}
                            >
                                ${emoji}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">
                        Especialidade (opcional)
                    </label>
                    <input
                        type="text"
                        id="agent-specialty"
                        placeholder="Ex: Análise de dados, Design, Copywriting..."
                        style="width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 1rem;"
                    />
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top: 0.5rem;">
                    Adicionar Agente
                </button>
            </form>
        `;

        Modal.show('Novo Agente', content);

        setTimeout(() => {
            const form = document.getElementById('new-agent-form');
            form?.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('agent-name').value;
                const selectedAvatar = document.querySelector('.avatar-option[style*="border-color: rgb(37, 99, 235)"]');
                const avatar = selectedAvatar?.dataset.avatar || '🤖';

                Utils.showNotification(`Agente "${name}" adicionado à mesa de trabalho!`, 'success');
                Modal.hide();
            });
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
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" />
                        Modo escuro (em breve)
                    </label>
                </div>
                <div>
                    <h4 style="margin-bottom: 0.5rem; font-weight: 600;">Sobre</h4>
                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.5;">
                        i.Andre v1.0.0<br>
                        Sistema de Gerenciamento de Agentes AI<br>
                        Desenvolvido com ❤️ por Anna
                    </p>
                </div>
                <button class="btn btn-primary" onclick="document.getElementById('modal-close').click();">
                    Salvar Configurações
                </button>
            </div>
        `;

        Modal.show('Configurações', content);
    },

    // Ver detalhes de agente
    handleAgentDetails(agentElement) {
        const agentId = agentElement.dataset.agent;
        const agent = AppState.agents.find(a => a.id === agentId);

        if (!agent) return;

        const agentTasks = AppState.tasks.filter(t =>
            t.agent.toLowerCase() === agent.name.toLowerCase()
        );

        const content = `
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div style="text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">${agent.avatar}</div>
                    <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">${agent.name}</h3>
                    <span class="badge badge-${agent.status === 'active' ? 'success' : 'info'}">
                        ${agent.status === 'active' ? '● Ativo' : '○ Ocioso'}
                    </span>
                </div>

                <div>
                    <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Atividade Atual</h4>
                    <p style="color: #6b7280; font-style: italic;">${agent.activity}</p>
                </div>

                <div>
                    <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Tarefas (${agentTasks.length})</h4>
                    ${agentTasks.length > 0 ? `
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${agentTasks.map(task => `
                                <li style="padding: 0.5rem; background: #f9fafb; border-radius: 0.5rem; margin-bottom: 0.5rem;">
                                    <strong>${task.title}</strong><br>
                                    <small style="color: #6b7280;">Iniciada ${Utils.formatTimeAgo(task.startedAt)}</small>
                                </li>
                            `).join('')}
                        </ul>
                    ` : '<p style="color: #9ca3af; font-style: italic;">Nenhuma tarefa atribuída</p>'}
                </div>

                <button class="btn btn-primary">
                    Atribuir Nova Tarefa
                </button>
            </div>
        `;

        Modal.show(`Agente: ${agent.name}`, content);
    },

    // Ver detalhes de tarefa
    handleTaskDetails(taskElement) {
        const taskTitle = taskElement.querySelector('.task-title')?.textContent;

        const content = `
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div>
                    <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Descrição</h4>
                    <p style="color: #6b7280;">Detalhes da tarefa "${taskTitle}" serão exibidos aqui.</p>
                </div>
                <div>
                    <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Status</h4>
                    <span class="badge badge-info">Em andamento</span>
                </div>
                <div>
                    <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Ações</h4>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary">Pausar</button>
                        <button class="btn btn-secondary">Reatribuir</button>
                        <button class="btn btn-primary">Concluir</button>
                    </div>
                </div>
            </div>
        `;

        Modal.show(taskTitle, content);
    },

    // Ver todas as tarefas
    handleAllTasks() {
        Utils.showNotification('Página de todas as tarefas em desenvolvimento', 'info');
    }
};

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 i.Andre Dashboard inicializado');

    // Inicializar modal
    Modal.init();

    // Event listeners para botões principais
    document.getElementById('btn-new-task')?.addEventListener('click', EventHandlers.handleNewTask);
    document.getElementById('btn-new-agent')?.addEventListener('click', EventHandlers.handleNewAgent);
    document.getElementById('btn-settings')?.addEventListener('click', EventHandlers.handleSettings);
    document.getElementById('btn-all-tasks')?.addEventListener('click', EventHandlers.handleAllTasks);

    // Event listeners para agent cards
    document.querySelectorAll('.agent-card').forEach(card => {
        card.querySelector('.agent-action-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            EventHandlers.handleAgentDetails(card);
        });
    });

    // Event listeners para task cards
    document.querySelectorAll('.task-card').forEach(card => {
        card.querySelector('.task-details-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            EventHandlers.handleTaskDetails(card);
        });
    });

    // Atualizar timestamps a cada minuto
    setInterval(() => {
        document.querySelectorAll('.task-time').forEach((element, index) => {
            const task = AppState.tasks[index];
            if (task) {
                element.textContent = `Iniciada ${Utils.formatTimeAgo(task.startedAt)}`;
            }
        });
    }, 60000);

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
    utils: Utils
};
