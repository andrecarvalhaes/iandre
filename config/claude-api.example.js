/**
 * Configuração da Claude API
 * By Lucas - AI Integration
 *
 * INSTRUÇÕES:
 * 1. Copie este arquivo para: config/claude-api.js
 * 2. Adicione sua API key da Anthropic
 * 3. Nunca commite o arquivo claude-api.js (está no .gitignore)
 */

// IMPORTANTE: Esta chave deve ser mantida em segredo!
// Em produção, mova para variáveis de ambiente no backend
const CLAUDE_API_CONFIG = {
    // Cole sua API Key da Anthropic aqui
    apiKey: '', // CONFIGURAR: Obtenha em https://console.anthropic.com/settings/keys
    apiUrl: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-20250514', // Modelo mais recente
    maxTokens: 4000,
    temperature: 0.7
};

// Verificar se API está configurada
function isClaudeConfigured() {
    return CLAUDE_API_CONFIG.apiKey && CLAUDE_API_CONFIG.apiKey.length > 0;
}

// Exportar configuração
window.ClaudeConfig = {
    ...CLAUDE_API_CONFIG,
    isConfigured: isClaudeConfigured
};

console.log('⚙️ Claude API Config:', window.ClaudeConfig.isConfigured() ? 'Configurada' : 'Aguardando API Key');
