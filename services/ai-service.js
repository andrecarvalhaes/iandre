/**
 * Serviço de IA - Claude API
 * By Lucas - AI Integration
 */

const AIService = {
    // Prompts dos agentes (do banco)
    agentPrompts: {},

    // Carregar prompts dos agentes
    async loadAgentPrompts() {
        try {
            const agents = await window.AgentService.getAll();
            agents.forEach(agent => {
                this.agentPrompts[agent.slug] = agent.prompt_sistema;
            });
            console.log('✅ Prompts dos agentes carregados:', Object.keys(this.agentPrompts));
        } catch (error) {
            console.error('Erro ao carregar prompts:', error);
        }
    },

    // Enviar mensagem para Claude API
    async sendMessage(agentSlug, userMessage, conversationHistory = []) {
        // Verificar se API está configurada
        if (!window.ClaudeConfig.isConfigured()) {
            return this.getMockResponse(agentSlug, userMessage);
        }

        try {
            // Construir mensagens para a API
            const messages = this.buildMessages(conversationHistory, userMessage);

            // System prompt do agente
            const systemPrompt = this.agentPrompts[agentSlug] ||
                `Você é ${agentSlug}, um assistente AI especializado.`;

            // Fazer requisição para Claude API
            const response = await fetch(window.ClaudeConfig.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': window.ClaudeConfig.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: window.ClaudeConfig.model,
                    max_tokens: window.ClaudeConfig.maxTokens,
                    temperature: window.ClaudeConfig.temperature,
                    system: systemPrompt,
                    messages: messages
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Erro na API');
            }

            const data = await response.json();

            // Extrair resposta
            return data.content[0].text;

        } catch (error) {
            console.error('Erro ao chamar Claude API:', error);

            // Fallback para mock se API falhar
            return this.getMockResponse(agentSlug, userMessage, error.message);
        }
    },

    // Construir array de mensagens para API
    buildMessages(history, newMessage) {
        const messages = [];

        // Adicionar histórico (últimas 10 mensagens para contexto)
        const recentHistory = history.slice(-10);
        recentHistory.forEach(msg => {
            messages.push({
                role: msg.tipo_remetente === 'usuario' ? 'user' : 'assistant',
                content: msg.conteudo
            });
        });

        // Adicionar nova mensagem do usuário
        messages.push({
            role: 'user',
            content: newMessage
        });

        return messages;
    },

    // Resposta mock (fallback)
    getMockResponse(agentSlug, userMessage, error = null) {
        const mockResponses = {
            anna: `Olá! Sou Anna, especialista em UX/UI. ${error ? '(Modo offline - API não configurada)' : ''}\n\nRecebi sua mensagem: "${userMessage}"\n\nPara ativar respostas reais, configure a Claude API Key.`,

            nick: `Olá! Sou Nick, especialista em Database. ${error ? '(Modo offline - API não configurada)' : ''}\n\nRecebi sua mensagem: "${userMessage}"\n\nPara ativar respostas reais, configure a Claude API Key.`,

            lucas: `Olá! Sou Lucas, especialista em Backend. ${error ? '(Modo offline - API não configurada)' : ''}\n\nRecebi sua mensagem: "${userMessage}"\n\nPara ativar respostas reais, configure a Claude API Key.`
        };

        return mockResponses[agentSlug] || `Olá! Recebi sua mensagem: "${userMessage}"`;
    },

    // Verificar status da API
    async checkAPIStatus() {
        if (!window.ClaudeConfig.isConfigured()) {
            return {
                status: 'not_configured',
                message: 'API Key não configurada'
            };
        }

        try {
            // Fazer uma requisição de teste simples
            const response = await fetch(window.ClaudeConfig.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': window.ClaudeConfig.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: window.ClaudeConfig.model,
                    max_tokens: 10,
                    messages: [{ role: 'user', content: 'test' }]
                })
            });

            if (response.ok) {
                return {
                    status: 'active',
                    message: '✅ Claude API conectada e funcionando'
                };
            } else {
                return {
                    status: 'error',
                    message: '❌ Erro na API: ' + response.status
                };
            }
        } catch (error) {
            return {
                status: 'error',
                message: '❌ Erro de conexão: ' + error.message
            };
        }
    }
};

// Inicializar
AIService.loadAgentPrompts();

window.AIService = AIService;
