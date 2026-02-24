# 🔧 Troubleshooting - i.andre

**Soluções para problemas comuns**

---

## ❌ **Erro: "Cannot read properties of undefined (reading 'auth')"**

### **Causa:**
O Supabase Client não está inicializado quando os serviços tentam acessá-lo.

### **Solução:**

✅ **CORREÇÃO APLICADA:**
- Adicionado `scripts/init.js` que aguarda o Supabase carregar
- Melhorada inicialização em `config/supabase.js`
- Ordem de scripts corrigida no HTML

### **Se o erro persistir:**

1. **Limpe o cache do navegador:**
   - Chrome: `Ctrl + Shift + Delete`
   - Selecione "Cached images and files"
   - Clique "Clear data"

2. **Faça hard reload:**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. **Verifique o Console:**
   - Pressione `F12`
   - Vá para aba "Console"
   - Procure por mensagens de erro

4. **Teste o Supabase CDN:**
   Abra o Console (F12) e teste:
   ```javascript
   console.log(typeof window.supabase); // Deve retornar 'object'
   console.log(window.SupabaseClient); // Deve retornar o cliente
   ```

---

## ❌ **Página em branco / Não carrega**

### **Verificações:**

1. **Abra o Console (F12)**
   - Veja se há erros em vermelho

2. **Verifique se os arquivos existem:**
   - `scripts/init.js` ✅
   - `config/supabase.js` ✅
   - `services/*.js` ✅

3. **Teste abrir cada arquivo individualmente:**
   - Se algum arquivo não abrir, o caminho está errado

---

## ❌ **Erro: "Failed to fetch" ou "Network error"**

### **Causa:**
Problema de conexão com Supabase.

### **Solução:**

1. **Verifique se o Supabase está online:**
   - Acesse: https://vwzgreramlxwzmtbhchl.supabase.co
   - Deve retornar uma resposta JSON

2. **Verifique suas credenciais:**
   - Abra `config/supabase.js`
   - Confirme URL e ANON_KEY

3. **Teste conexão manualmente:**
   ```javascript
   fetch('https://vwzgreramlxwzmtbhchl.supabase.co/rest/v1/')
     .then(r => console.log('✅ Supabase online:', r.status))
     .catch(e => console.error('❌ Supabase offline:', e))
   ```

---

## ❌ **Login não funciona**

### **Possíveis causas:**

1. **Senha não configurada:**
   ```sql
   -- Execute no Supabase SQL Editor:
   UPDATE auth.users
   SET encrypted_password = crypt('Teste@123', gen_salt('bf'))
   WHERE email = 'andrecarva97@gmail.com';
   ```

2. **Email incorreto:**
   - Verifique se o email está exatamente como no banco
   - Case-sensitive!

3. **Usuário não confirmado:**
   ```sql
   UPDATE auth.users
   SET email_confirmed_at = NOW()
   WHERE email = 'andrecarva97@gmail.com';
   ```

---

## ❌ **Dados não aparecem no Dashboard**

### **Verificações:**

1. **Verifique se o seed foi executado:**
   ```sql
   SELECT COUNT(*) FROM agentes; -- Deve retornar 3
   SELECT COUNT(*) FROM tarefas; -- Deve retornar pelo menos 1
   ```

2. **Verifique RLS:**
   - Certifique-se de que está logado
   - RLS bloqueia acesso se não autenticado

3. **Teste queries manualmente:**
   ```javascript
   // No Console (F12):
   window.AgentService.getAll()
     .then(data => console.log('Agentes:', data))
   ```

---

## ❌ **Chat não funciona**

### **Possíveis causas:**

1. **Agente não existe no banco:**
   ```sql
   SELECT * FROM agentes;
   ```

2. **Tabela mensagens não criada:**
   ```sql
   SELECT * FROM mensagens LIMIT 1;
   ```

3. **Erro no service:**
   - Abra Console (F12)
   - Veja erros quando tentar enviar mensagem

---

## ❌ **Realtime não atualiza**

### **Solução:**

1. **Verifique se Realtime está habilitado no Supabase:**
   - Dashboard → Settings → API
   - "Realtime" deve estar "Enabled"

2. **Teste subscription:**
   ```javascript
   // No Console (F12):
   const sub = window.SupabaseClient
     .channel('test')
     .on('postgres_changes', { event: '*', schema: 'public', table: 'tarefas' }, console.log)
     .subscribe()
   ```

---

## 🔍 **Diagnóstico Geral**

Execute no Console (F12):

```javascript
// Status do sistema
console.log('=== DIAGNÓSTICO i.andre ===');
console.log('Supabase CDN:', typeof window.supabase);
console.log('Supabase Client:', !!window.SupabaseClient);
console.log('Auth Service:', !!window.AuthService);
console.log('Agent Service:', !!window.AgentService);
console.log('Task Service:', !!window.TaskService);
console.log('Message Service:', !!window.MessageService);
console.log('Metrics Service:', !!window.MetricsService);

// Testar conexão
window.SupabaseClient.from('agentes').select('count')
  .then(r => console.log('✅ Database OK:', r))
  .catch(e => console.error('❌ Database Error:', e));

// Testar auth
window.SupabaseClient.auth.getSession()
  .then(r => console.log('Auth Session:', r.data.session ? 'Logged in' : 'Not logged in'))
  .catch(e => console.error('❌ Auth Error:', e));
```

---

## 📞 **Ainda com problemas?**

### **Checklist Final:**

- [ ] Supabase está online
- [ ] Schema foi executado (schema.sql)
- [ ] Seed foi executado (seed-v2.sql)
- [ ] Senha do usuário foi configurada
- [ ] Cache do navegador foi limpo
- [ ] Console não mostra erros

### **Recomeçar do zero:**

1. Limpe tudo:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

2. Feche e abra o navegador

3. Abra `auth.html`

4. Faça login

5. Se funcionar, ótimo! Se não, veja os erros no Console.

---

## ✅ **Sistema Funcionando?**

Você deve ver:
- ✅ Login funcionando
- ✅ 3 agentes no dashboard
- ✅ Métricas reais
- ✅ Chat abrindo
- ✅ Criar tarefa funcionando

---

**Se nada funcionar, me avise com a mensagem de erro exata do Console!** 🚀
