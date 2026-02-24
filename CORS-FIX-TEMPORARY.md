# ⚠️ Solução TEMPORÁRIA para CORS (Desenvolvimento)

**ATENÇÃO:** Esta solução é APENAS para testes locais. NUNCA use em produção!

---

## Opção A: Extensão CORS no Chrome

1. **Instale a extensão:**
   - Chrome Web Store: "CORS Unblock" ou "Allow CORS"
   - Link: https://chrome.google.com/webstore/search/cors

2. **Ative a extensão**

3. **Recarregue a página** (Ctrl + Shift + R)

4. **Teste o chat**

⚠️ **LEMBRE-SE:** Desative após os testes!

---

## Opção B: Chrome com CORS Desabilitado

1. **Feche TODOS os processos do Chrome** (Task Manager)

2. **Crie um atalho do Chrome** com parâmetros:

   **Windows:**
   ```
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:\chrome-dev-session"
   ```

3. **Abra o Chrome por esse atalho**

4. **Verá um aviso:** "Você está usando uma sinalização de linha de comando não compatível"

5. **Abra:** `C:/Users/ClubPetro-123/Documents/i.andre/index.html`

6. **Teste o chat**

⚠️ **IMPORTANTE:**
- Use APENAS para desenvolvimento
- NÃO navegue em sites normais nessa janela
- Feche quando terminar os testes

---

## Por que NÃO usar em produção?

- Desabilita segurança importante
- Expõe o navegador a ataques
- Só funciona localmente
- Não é escalável

---

## ✅ Solução CORRETA:

**Use um servidor HTTP local!**

- Python: `python -m http.server 8000`
- Node: `npm start`
- VS Code: Live Server extension

Ou mova a chamada da API para o backend (mais seguro).

---

## Solução Definitiva (Produção)

Para produção, a API key NÃO pode estar no frontend!

Crie um backend proxy:

```
Frontend → Seu Backend → Claude API
```

Benefícios:
- API key fica segura
- Sem problemas de CORS
- Controle de rate limiting
- Logs e monitoramento
