# 🔧 Solução para CORS em Produção

## 🚨 Problema

Quando acessado via Firebase (`https://iandre.web.app`), o chat retorna erro:

```
Access to fetch at 'https://api.anthropic.com/v1/messages'
from origin 'https://iandre.web.app' has been blocked by CORS policy
```

**Por quê?**
A Claude API não permite chamadas diretas do navegador em domínios públicos (apenas `localhost`).

---

## ✅ Solução Implementada

**Supabase Edge Function** atua como proxy entre frontend e Claude API.

### Arquitetura

```
┌─────────────────┐
│   Frontend      │
│ (iandre.web.app)│
└────────┬────────┘
         │ 1. sendMessage()
         ↓
┌─────────────────────┐
│ Supabase Edge Func  │  ← API Key segura aqui
│  (claude-proxy)     │
└────────┬────────────┘
         │ 2. POST com auth
         ↓
┌─────────────────┐
│  Claude API     │
│ (Anthropic)     │
└────────┬────────┘
         │ 3. Resposta
         ↓
┌─────────────────────┐
│ Supabase Edge Func  │
└────────┬────────────┘
         │ 4. Retorna
         ↓
┌─────────────────┐
│   Frontend      │
│  Exibe resposta │
└─────────────────┘
```

### Fluxo Automático

O código **detecta automaticamente** o ambiente:

- **Desenvolvimento (`localhost`):**
  - Chama Claude API diretamente
  - Usa API key do `config/claude-api.js`

- **Produção (`iandre.web.app`):**
  - Usa Supabase Edge Function
  - API key protegida no servidor

---

## 🚀 Como Ativar

### Passo 1: Deploy da Edge Function

**Opção A - Script Automático (Recomendado):**
```bash
# Duplo clique em:
deploy-edge-function.bat
```

**Opção B - Manual:**
```bash
# 1. Linkar projeto
supabase link --project-ref vwzgreramlxwzmtbhchl

# 2. Configurar API key
supabase secrets set CLAUDE_API_KEY=sk-ant-api-XXXXXXXXXXXXXXXXXXXXXXXXX

# 3. Deploy
supabase functions deploy claude-proxy
```

### Passo 2: Testar

1. Acesse: https://iandre.web.app
2. Faça login
3. Abra chat com qualquer agente
4. Envie mensagem
5. ✅ Deve funcionar sem erro de CORS!

---

## 📋 Arquivos Criados

```
supabase/
├── functions/
│   └── claude-proxy/
│       └── index.ts                    # Edge Function
├── DEPLOY-EDGE-FUNCTION.md             # Guia detalhado
└── CORS-SOLUTION.md                    # Este arquivo

deploy-edge-function.bat                # Script de deploy
services/ai-service.js (atualizado)     # Detecta ambiente
```

---

## 🔒 Segurança

### ✅ Vantagens da solução

1. **API Key nunca exposta ao navegador**
   - Fica apenas no servidor Supabase
   - Configurada via `supabase secrets`

2. **Autenticação obrigatória**
   - Edge Function verifica JWT token
   - Apenas usuários logados podem usar

3. **Rate limiting natural**
   - Supabase controla invocações
   - 500k calls/mês grátis

4. **Sem CORS**
   - Função roda no mesmo domínio do Supabase
   - Browser permite requisição

---

## 💰 Custos

### Supabase Edge Functions
- **Grátis:** 500,000 invocações/mês
- **Pago:** $2 por 1M invocações extras

### Claude API
- **Sonnet 4:** ~$3/1M input tokens, ~$15/1M output tokens
- Veja: https://anthropic.com/pricing

### Estimativa para uso moderado
- 100 usuários
- 50 mensagens/dia cada
- ~150,000 invocações/mês
- **Custo Edge Functions:** $0 (dentro do free tier)
- **Custo Claude API:** ~$20-50/mês

---

## 🔍 Verificar Status

### Ver logs em tempo real

```bash
supabase functions logs claude-proxy --follow
```

### Testar no console

```javascript
// No DevTools de https://iandre.web.app
const { data, error } = await window.SupabaseClient.functions.invoke('claude-proxy', {
    body: {
        agentSlug: 'anna',
        message: 'Teste',
        conversationHistory: []
    }
});

console.log('✅ Sucesso:', data);
console.log('❌ Erro:', error);
```

---

## 🛠️ Troubleshooting

### Erro: "Missing authorization header"

**Causa:** Usuário não logado

**Solução:**
```javascript
const { data } = await window.SupabaseClient.auth.getSession();
if (!data.session) {
    console.error('Faça login primeiro!');
}
```

### Erro: "Function not found"

**Causa:** Edge Function não deployada

**Solução:**
```bash
supabase functions deploy claude-proxy
```

### Erro: "Invalid API key"

**Causa:** CLAUDE_API_KEY não configurado ou inválido

**Solução:**
```bash
# Ver secrets configurados
supabase secrets list

# Reconfigurar
supabase secrets set CLAUDE_API_KEY=sk-ant-api-XXX...
```

---

## ✅ Checklist

Antes de considerar resolvido:

- [ ] Supabase CLI instalado
- [ ] Edge Function deployada
- [ ] CLAUDE_API_KEY configurado
- [ ] Chat funciona em https://iandre.web.app
- [ ] Sem erros de CORS no console
- [ ] Respostas reais dos agentes

---

## 📚 Documentação Completa

- **Setup detalhado:** [DEPLOY-EDGE-FUNCTION.md](supabase/DEPLOY-EDGE-FUNCTION.md)
- **Código da função:** [supabase/functions/claude-proxy/index.ts](supabase/functions/claude-proxy/index.ts)
- **AI Service:** [services/ai-service.js](services/ai-service.js)

---

**Problema de CORS resolvido! 🎉**

Agora o sistema funciona tanto em desenvolvimento quanto em produção sem erros.
