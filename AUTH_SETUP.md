# 🔐 Setup de Autenticação

**By Lucas - Auth Implementation**

---

## ⚠️ IMPORTANTE: Configurar Senha do Usuário

O usuário `andrecarva97@gmail.com` foi criado no banco, mas precisa de uma senha para fazer login.

### **📋 OPÇÃO 1: Resetar Senha via Dashboard (Recomendado)**

1. Acesse: https://supabase.com/dashboard/project/vwzgreramlxwzmtbhchl/auth/users

2. Encontre o usuário `andrecarva97@gmail.com`

3. Clique nos **três pontos** (⋮) ao lado do usuário

4. Selecione **"Send password reset email"**

5. OU selecione **"Reset password"** e defina uma nova senha

6. **Defina uma senha** (ex: `Teste@123`)

---

### **📋 OPÇÃO 2: Atualizar Senha via SQL**

Execute no SQL Editor do Supabase:

```sql
-- Atualizar senha do usuário
UPDATE auth.users
SET
  encrypted_password = crypt('Teste@123', gen_salt('bf')),
  email_confirmed_at = NOW(),
  updated_at = NOW()
WHERE email = 'andrecarva97@gmail.com';
```

**Senha definida:** `Teste@123`

---

### **📋 OPÇÃO 3: Criar Novo Usuário com Senha**

Se preferir criar um novo usuário completo:

```sql
-- Criar usuário com senha
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'novo@usuario.com',
  crypt('SuaSenha123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  'authenticated',
  'authenticated'
);
```

---

## 🚀 COMO USAR O SISTEMA

### **1. Fazer Login**

1. Abra: [auth.html](auth.html)

2. Credenciais:
   - **Email:** `andrecarva97@gmail.com`
   - **Senha:** `Teste@123` (ou a que você definiu)

3. Clique em **"Entrar"**

4. ✅ Será redirecionado para o dashboard

---

### **2. Dashboard Protegido**

- ✅ Apenas usuários autenticados podem acessar
- ✅ Se não estiver logado, redireciona para login
- ✅ Botão de logout no header
- ✅ Email do usuário exibido no header

---

### **3. Fazer Logout**

1. No dashboard, clique no botão **🚪** (Sair)
2. Confirme a ação
3. ✅ Será desconectado e redirecionado para login

---

## 🔒 SEGURANÇA IMPLEMENTADA

### **Row Level Security (RLS)**

O RLS do Supabase está ativo e configurado:

✅ **Usuários só veem seus próprios dados:**
- Apenas workspaces que pertencem ao usuário
- Apenas agentes de seus workspaces
- Apenas tarefas de seus workspaces
- Apenas mensagens de seus agentes

✅ **Proteção de rotas:**
- Dashboard só acessível com login
- Verificação automática de sessão
- Redirecionamento automático se não autenticado

✅ **Session Management:**
- Sessão persistente (não expira entre reloads)
- Logout limpa sessão completamente
- Token JWT seguro gerenciado pelo Supabase

---

## 🧪 TESTAR AUTENTICAÇÃO

### **Teste 1: Login Bem-Sucedido**

1. Vá para `auth.html`
2. Digite credenciais corretas
3. ✅ Deve redirecionar para dashboard
4. ✅ Email deve aparecer no header

### **Teste 2: Proteção de Rota**

1. Faça logout
2. Tente acessar `index.html` diretamente
3. ✅ Deve redirecionar automaticamente para `auth.html`

### **Teste 3: Logout**

1. No dashboard, clique em "Sair"
2. ✅ Deve voltar para tela de login
3. Tente acessar `index.html` novamente
4. ✅ Deve redirecionar para login

### **Teste 4: Senha Incorreta**

1. Na tela de login, digite senha errada
2. ✅ Deve mostrar mensagem de erro
3. ✅ Não deve permitir acesso

---

## 📁 ARQUIVOS CRIADOS

- ✅ **[auth.html](auth.html)** - Tela de login
- ✅ **[services/auth-service.js](services/auth-service.js)** - Serviço de autenticação
- ✅ **[scripts/dashboard-v2.js](scripts/dashboard-v2.js)** - Atualizado com auth check
- ✅ **[index.html](index.html)** - Atualizado com botão de logout

---

## 🎯 FEATURES IMPLEMENTADAS

✅ **Login/Logout**
- Tela de login funcional
- Integração com Supabase Auth
- Logout com limpeza de sessão

✅ **Proteção de Rotas**
- Verificação automática de auth
- Redirecionamento se não autenticado
- Session management

✅ **UX Melhorada**
- Loading state no botão
- Mensagens de erro claras
- Email do usuário no header
- Confirmação de logout

✅ **Segurança**
- RLS ativo no Supabase
- JWT tokens seguros
- Isolamento de dados por usuário

---

## 🐛 TROUBLESHOOTING

### **Erro: "Invalid login credentials"**
**Solução:** A senha não foi configurada ou está incorreta. Configure a senha usando uma das opções acima.

### **Redirecionamento infinito**
**Solução:** Limpe o cache do navegador e cookies. Verifique se o Supabase está respondendo corretamente.

### **Não consegue fazer logout**
**Solução:** Abra o Console (F12), veja se há erros. Limpe localStorage manualmente se necessário:
```javascript
localStorage.clear()
```

---

## ✅ CHECKLIST

Antes de testar:
- [ ] Senha do usuário configurada no Supabase
- [ ] auth.html abre corretamente
- [ ] Supabase está online
- [ ] Credenciais corretas anotadas

Após login:
- [ ] Dashboard carrega dados
- [ ] Email aparece no header
- [ ] Botão de logout funciona
- [ ] Logout redireciona para login

---

## 🎉 PRONTO PARA USO!

**Credenciais:**
- Email: `andrecarva97@gmail.com`
- Senha: `Teste@123` (defina uma no Supabase primeiro)

**Fluxo completo:**
1. Abrir `auth.html`
2. Fazer login
3. Usar dashboard
4. Fazer logout

---

**Sistema de autenticação implementado por Lucas 🔐**
*Seguro, funcional e pronto para produção*
