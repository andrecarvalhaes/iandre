# 🗄️ Database Setup - i.andre

Arquitetura de dados criada por **Nick** - Database Architect

---

## 📋 Arquivos

- **`schema.sql`** - Estrutura completa do banco (tabelas, índices, triggers, RLS)
- **`seed.sql`** - Dados iniciais (agentes Anna, Nick, Lucas e workspace padrão)

---

## 🚀 Como Executar

### **1. Acessar o Supabase SQL Editor**

1. Acesse: https://supabase.com/dashboard/project/vwzgreramlxwzmtbhchl
2. Vá em **SQL Editor** no menu lateral

### **2. Executar Schema (Estrutura)**

1. Clique em **New Query**
2. Copie todo o conteúdo de `schema.sql`
3. Cole no editor
4. Clique em **Run** (ou `Ctrl + Enter`)
5. Aguarde confirmação de sucesso ✅

### **3. Criar Usuário (Auth)**

Antes de executar o seed, você precisa ter um usuário:

**Opção A - Via Dashboard:**
1. Vá em **Authentication** → **Users**
2. Clique em **Add user**
3. Crie um usuário com email/senha

**Opção B - Via SQL:**
```sql
-- Executar no SQL Editor
SELECT auth.uid(); -- Verificar se há usuário logado
```

### **4. Executar Seed (Dados Iniciais)**

1. **IMPORTANTE:** Faça login no Supabase com o usuário criado
2. Clique em **New Query**
3. Copie todo o conteúdo de `seed.sql`
4. Cole no editor
5. Clique em **Run**
6. Aguarde confirmação de sucesso ✅

### **5. Verificar Instalação**

Execute no SQL Editor:

```sql
-- Ver todas as tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Ver agentes criados
SELECT nome, papel, status, avatar
FROM agentes;

-- Ver métricas do workspace
SELECT * FROM metricas_espaco_trabalho;
```

---

## 📊 Estrutura Criada

### **Tabelas:**
- ✅ `perfis_usuario` - Perfis dos usuários
- ✅ `espacos_trabalho` - Workspaces/organizações
- ✅ `agentes` - Agentes AI (Anna, Nick, Lucas)
- ✅ `tarefas` - Tarefas atribuídas aos agentes
- ✅ `mensagens` - Chat entre usuário e agentes
- ✅ `atividades_tarefa` - Log de atividades
- ✅ `historico_agentes` - Histórico de mudanças
- ✅ `anexos` - Arquivos anexados

### **Views:**
- ✅ `estatisticas_agentes` - Métricas por agente
- ✅ `metricas_espaco_trabalho` - Métricas do workspace

### **Triggers:**
- ✅ Auto-atualização de timestamps
- ✅ Log automático de mudanças de status
- ✅ Registro de atividades de tarefas

### **RLS (Segurança):**
- ✅ Políticas de acesso por usuário
- ✅ Isolamento entre workspaces
- ✅ Proteção de dados

---

## 🔑 Credenciais para Frontend

Após executar os scripts, anote estas informações para usar no frontend:

```javascript
// config/supabase.js
const supabaseUrl = 'https://vwzgreramlxwzmtbhchl.supabase.co'
const supabaseAnonKey = 'SUA_ANON_KEY' // Pegar em Settings → API
```

**Para obter a Anon Key:**
1. Vá em **Settings** → **API**
2. Copie a **anon/public** key

---

## ✅ Checklist de Instalação

- [ ] Schema executado com sucesso
- [ ] Usuário criado no Auth
- [ ] Seed executado com sucesso
- [ ] 3 agentes criados (Anna, Nick, Lucas)
- [ ] Views funcionando
- [ ] Triggers ativos
- [ ] RLS configurado

---

## 🆘 Troubleshooting

### **Erro: "auth.uid() returned null"**
**Solução:** Você precisa estar logado. Crie um usuário e faça login antes de executar o seed.

### **Erro: "permission denied"**
**Solução:** Verifique se está usando a **service_role** key (não a anon key).

### **Erro: "relation already exists"**
**Solução:** As tabelas já foram criadas. Se quiser recriar, delete-as primeiro:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

---

## 📞 Próximos Passos

Após executar com sucesso:

1. ✅ **Lucas** vai configurar a integração frontend-backend
2. ✅ **Anna** vai refatorar o frontend para usar dados reais
3. ✅ Implementar autenticação no frontend
4. ✅ Criar componente de chat integrado

---

**Database criado por Nick 🗄️**
*Escalável, seguro e pronto para produção*
