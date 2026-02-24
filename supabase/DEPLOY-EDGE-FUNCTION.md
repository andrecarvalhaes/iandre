# 🚀 Deploy Supabase Edge Function - Claude Proxy

**Solução para CORS em produção**

A Claude API não permite chamadas diretas do navegador em produção. Esta Edge Function resolve esse problema atuando como proxy seguro.

---

## 📋 Pré-requisitos

1. **Supabase CLI instalado:**
   ```bash
   npm install -g supabase
   ```

2. **Login no Supabase:**
   ```bash
   supabase login
   ```

3. **API Key da Claude:**
   - Obtenha em: https://console.anthropic.com/settings/keys

---

## 🔧 Configuração

### 1. Linkar projeto Supabase

```bash
cd c:\Users\ClubPetro-123\Documents\i.andre
supabase link --project-ref vwzgreramlxwzmtbhchl
```

### 2. Configurar secrets (API Key da Claude)

```bash
supabase secrets set CLAUDE_API_KEY=sk-ant-api-XXXXXXXXXXXXXXXXXXXXXXXXX
```

Substitua `sk-ant-api-XXX...` pela sua API key real da Claude.

---

## 🚀 Deploy

### Deploy da função

```bash
supabase functions deploy claude-proxy
```

Isso vai:
- ✅ Fazer upload do código
- ✅ Criar endpoint público
- ✅ Configurar variáveis de ambiente

### URL da função

Após o deploy, você terá:
```
https://vwzgreramlxwzmtbhchl.supabase.co/functions/v1/claude-proxy
```

---

## ✅ Testar

### Teste local (opcional)

```bash
# Servir função localmente
supabase functions serve claude-proxy --env-file ./supabase/.env.local

# Em outro terminal, testar:
curl -i --location --request POST 'http://localhost:54321/functions/v1/claude-proxy' \
  --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"agentSlug":"anna","message":"Olá!","conversationHistory":[]}'
```

### Teste em produção

Abra o Console do navegador em https://iandre.web.app e execute:

```javascript
// Testar Edge Function
const { data, error } = await window.SupabaseClient.functions.invoke('claude-proxy', {
    body: {
        agentSlug: 'anna',
        message: 'Olá Anna!',
        conversationHistory: []
    }
});

console.log('Resposta:', data);
console.log('Erro:', error);
```

---

## 🔒 Segurança

### API Key protegida

✅ **API key nunca exposta ao navegador**
- Fica apenas no servidor (Supabase)
- Configurada via `supabase secrets set`

### Autenticação obrigatória

✅ **Apenas usuários autenticados podem usar**
- Função verifica JWT token
- Bloqueia requisições sem auth

### Rate limiting

⚠️ **Implementar se necessário:**
```sql
-- Criar tabela de rate limiting
CREATE TABLE api_usage (
    user_id UUID REFERENCES auth.users(id),
    endpoint TEXT,
    calls_count INTEGER DEFAULT 0,
    last_reset TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔍 Monitoramento

### Ver logs da função

```bash
supabase functions logs claude-proxy
```

### Dashboard Supabase

Acesse: https://supabase.com/dashboard/project/vwzgreramlxwzmtbhchl/functions

Você verá:
- 📊 Número de invocações
- ⏱️ Tempo médio de execução
- ❌ Taxa de erros
- 💰 Custos estimados

---

## 🛠️ Troubleshooting

### Erro: "Missing authorization header"

**Causa:** Usuário não está logado

**Solução:**
```javascript
// Verificar sessão
const { data } = await window.SupabaseClient.auth.getSession();
console.log('Sessão:', data.session);
```

### Erro: "Agent not found"

**Causa:** agentSlug inválido ou agente não existe no banco

**Solução:**
```javascript
// Verificar agentes disponíveis
const { data } = await window.SupabaseClient.from('agentes').select('slug');
console.log('Agentes:', data);
```

### Erro: "Claude API error"

**Causa:** Problema na Claude API ou API key inválida

**Solução:**
1. Verificar se secret está configurado:
   ```bash
   supabase secrets list
   ```
2. Reconfigurar se necessário:
   ```bash
   supabase secrets set CLAUDE_API_KEY=sk-ant-api-XXX...
   ```

---

## 💡 Como Funciona

### Fluxo

```
Usuário (Browser)
    ↓
[Frontend] ai-service.js
    ↓ (detecta produção)
Supabase Edge Function (claude-proxy)
    ↓ (busca agent.prompt_sistema)
Database (agentes table)
    ↓ (chama com system prompt)
Claude API
    ↓ (resposta)
Supabase Edge Function
    ↓ (retorna)
[Frontend] Exibe resposta
```

### Vantagens

✅ **Sem CORS** - Função roda no servidor
✅ **API Key segura** - Nunca exposta ao cliente
✅ **Autenticação** - Apenas usuários logados
✅ **Escalável** - Serverless (paga por uso)
✅ **Grátis** - 500k invocações/mês (plano free)

---

## 📦 Estrutura de Arquivos

```
supabase/
├── functions/
│   └── claude-proxy/
│       └── index.ts          # Código da função
└── DEPLOY-EDGE-FUNCTION.md   # Este arquivo
```

---

## 🔄 Atualizar Função

Após modificar `index.ts`:

```bash
supabase functions deploy claude-proxy
```

Mudanças são aplicadas instantaneamente.

---

## 💰 Custos

### Supabase Edge Functions (Free Tier)
- 500,000 invocações/mês: **GRÁTIS**
- Acima disso: $2 por 1M invocações

### Claude API
- Sonnet 4: ~$3 por 1M tokens input, ~$15 por 1M tokens output
- Veja: https://www.anthropic.com/pricing

---

## ✅ Checklist Final

Antes de usar em produção:

- [ ] Supabase CLI instalado
- [ ] Projeto linkado (`supabase link`)
- [ ] Secret CLAUDE_API_KEY configurado
- [ ] Função deployada (`supabase functions deploy`)
- [ ] Testado no console do navegador
- [ ] Chat funcionando em https://iandre.web.app

---

**Dúvidas?** Veja logs com `supabase functions logs claude-proxy`
