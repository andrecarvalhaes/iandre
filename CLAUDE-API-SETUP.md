# 🤖 Configuração da Claude API

**Guia completo para ativar respostas reais dos agentes**

---

## 📋 Pré-requisitos

✅ Sistema i.andre rodando
✅ Login funcionando
✅ Chat com agentes abrindo

---

## 🔑 Passo 1: Obter API Key da Anthropic

1. **Acesse o Console da Anthropic:**
   ```
   https://console.anthropic.com/
   ```

2. **Faça login ou crie uma conta**

3. **Navegue até API Keys:**
   - Menu lateral → "API Keys"
   - Ou acesse diretamente: https://console.anthropic.com/settings/keys

4. **Crie uma nova API Key:**
   - Clique em "Create Key"
   - Dê um nome: `i.andre-production`
   - Copie a key (começa com `sk-ant-api...`)
   - ⚠️ **IMPORTANTE:** Guarde em local seguro, ela só aparece uma vez!

---

## ⚙️ Passo 2: Configurar no Sistema

### Opção A: Editar Arquivo (Manual)

1. **Abra o arquivo:**
   ```
   config/claude-api.js
   ```

2. **Localize a linha:**
   ```javascript
   apiKey: '', // CONFIGURAR: Adicione sua API key da Anthropic aqui
   ```

3. **Adicione sua key:**
   ```javascript
   apiKey: 'sk-ant-api-XXXXXXXXXXXXXXXXXXXXXXXXX',
   ```

4. **Salve o arquivo**

5. **Recarregue a página** (Ctrl + Shift + R)

### Opção B: Via Console do Navegador (Rápido)

1. **Abra o Console** (F12)

2. **Execute:**
   ```javascript
   window.ClaudeConfig.apiKey = 'sk-ant-api-XXXXXXXXXXXXXXXXXXXXXXXXX';
   console.log('✅ API Key configurada!');
   ```

3. **Teste:**
   ```javascript
   window.ClaudeConfig.isConfigured(); // Deve retornar true
   ```

⚠️ **ATENÇÃO:** Configuração via console é temporária. Para permanente, use Opção A.

---

## 🧪 Passo 3: Testar Integração

### Teste Rápido no Console

```javascript
// 1. Verificar configuração
console.log('Configurado:', window.ClaudeConfig.isConfigured());

// 2. Testar chamada de IA (Anna)
await window.AIService.sendMessage('anna', 'Olá Anna, você está funcionando?')
  .then(response => console.log('Resposta:', response))
  .catch(error => console.error('Erro:', error));
```

### Teste no Chat

1. **Abra o dashboard** (index.html)
2. **Clique em "Ver detalhes"** em qualquer agente
3. **Envie uma mensagem:**
   ```
   Olá! Você pode me ajudar?
   ```
4. **Aguarde a resposta**

✅ **Sucesso:** Resposta personalizada do agente
❌ **Falha:** Resposta mock (genérica)

---

## 🔍 Verificação de Status

Execute no Console (F12):

```javascript
// Diagnóstico completo
console.log('=== DIAGNÓSTICO CLAUDE API ===');
console.log('API Key definida:', !!window.ClaudeConfig.apiKey);
console.log('API Key válida:', window.ClaudeConfig.isConfigured());
console.log('Modelo:', window.ClaudeConfig.model);
console.log('Max Tokens:', window.ClaudeConfig.maxTokens);
console.log('Temperature:', window.ClaudeConfig.temperature);
console.log('URL:', window.ClaudeConfig.apiUrl);
console.log('AI Service:', !!window.AIService);
console.log('Prompts carregados:', Object.keys(window.AIService.agentPrompts || {}));
```

---

## ⚠️ Solução de Problemas

### Erro: "Invalid API Key"

**Causa:** Key incorreta ou expirada

**Solução:**
1. Verifique se copiou a key completa
2. Gere uma nova key no Console da Anthropic
3. Reconfigure no sistema

### Erro: "Failed to fetch"

**Causa:** Problema de rede ou CORS

**Solução:**
1. Verifique sua conexão com internet
2. Teste o endpoint:
   ```javascript
   fetch('https://api.anthropic.com/v1/messages', {
     method: 'HEAD',
     headers: { 'x-api-key': window.ClaudeConfig.apiKey }
   }).then(r => console.log('Status:', r.status))
   ```

### Erro: "Rate limit exceeded"

**Causa:** Muitas requisições em pouco tempo

**Solução:**
1. Aguarde 1 minuto
2. Verifique limites da sua conta: https://console.anthropic.com/settings/limits
3. Considere upgrade se necessário

### Respostas Mock (genéricas)

**Causa:** API key não configurada ou inválida

**Verificar:**
```javascript
window.ClaudeConfig.isConfigured() // Deve retornar true
```

**Solução:**
- Configure a API key conforme Passo 2

---

## 📊 Modelos Disponíveis

Você pode alterar o modelo em `config/claude-api.js`:

```javascript
model: 'claude-sonnet-4-20250514', // Padrão (recomendado)
// model: 'claude-opus-4-20240229', // Mais poderoso, mais caro
// model: 'claude-haiku-4-20250514', // Mais rápido, mais barato
```

**Comparação:**

| Modelo | Velocidade | Custo | Qualidade |
|--------|-----------|-------|-----------|
| Haiku | ⚡⚡⚡ | 💰 | ⭐⭐ |
| Sonnet | ⚡⚡ | 💰💰 | ⭐⭐⭐ |
| Opus | ⚡ | 💰💰💰 | ⭐⭐⭐⭐ |

---

## 🎯 Personalidades dos Agentes

Cada agente tem seu próprio system prompt carregado do banco:

- **Anna (UX/UI Expert):** Foco em design, usabilidade, conversão
- **Nick (Database Architect):** Foco em modelagem, migrations, escalabilidade
- **Lucas (Backend Developer):** Foco em APIs, lógica de negócio, integração

Os prompts são carregados automaticamente da tabela `agentes` (coluna `prompt_sistema`).

---

## 💡 Dicas de Uso

1. **Conversas longas consomem mais tokens** - mantenha conversas focadas
2. **Cada mensagem envia histórico completo** - para contexto
3. **Temperature 0.7** é balanceada - ajuste se necessário
4. **Max tokens 4000** cobre a maioria dos casos

---

## 🔐 Segurança

⚠️ **NUNCA COMMITE A API KEY NO GIT!**

Se você usa Git, adicione ao `.gitignore`:

```gitignore
# Configurações sensíveis
config/claude-api.js
```

Ou crie um arquivo separado:
- `config/claude-api.example.js` (versionado, sem a key)
- `config/claude-api.js` (ignorado, com a key)

---

## ✅ Checklist Final

Antes de usar em produção:

- [ ] API key configurada
- [ ] Teste de chat funcionando
- [ ] Respostas personalizadas por agente
- [ ] Console sem erros
- [ ] API key adicionada ao .gitignore
- [ ] Monitoramento de custos ativo no Console Anthropic

---

## 🚀 Próximos Passos

Sistema funcionando? Considere:

1. **Monitorar uso:** https://console.anthropic.com/settings/usage
2. **Configurar billing alerts**
3. **Implementar rate limiting** (se muitos usuários)
4. **Criar UI para configuração** (sem editar código)
5. **Adicionar histórico persistente** (já tem no banco!)

---

**Precisa de ajuda? Verifique:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
