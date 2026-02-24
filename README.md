# i.Andre - Sistema de Gerenciamento de Agentes AI

Sistema multi-agente com integração Claude API para gerenciar tarefas e automatizar processos.

## 🌐 Deploy

**Site ao vivo:** [https://iandre.web.app](https://iandre.web.app)

**GitHub:** [https://github.com/andrecarvalhaes/iandre](https://github.com/andrecarvalhaes/iandre)

## 🚀 Como Usar

### Abertura Rápida

1. **Acesse online:**
   - Visite: [https://iandre.web.app](https://iandre.web.app)

2. **Desenvolvimento local (para integração Claude API):**
   ```bash
   # Windows - Duplo clique em:
   start-server.bat

   # Ou Python 3:
   python -m http.server 8000

   # Ou Node.js:
   npm start
   ```

   Depois acesse: `http://localhost:8000`

⚠️ **IMPORTANTE:** Para usar Claude API localmente, rode via servidor HTTP (não arquivo local) para evitar erros de CORS.

### Configurar Claude API (Desenvolvimento Local)

1. **Obtenha API key:** https://console.anthropic.com/settings/keys
2. **Configure:**
   ```bash
   # Copie o exemplo
   cp config/claude-api.example.js config/claude-api.js

   # Edite e adicione sua key
   # config/claude-api.js → apiKey: 'sk-ant-api...'
   ```
3. **Documentação completa:** [CLAUDE-API-SETUP.md](CLAUDE-API-SETUP.md)

## 📁 Estrutura do Projeto

```
i.andre/
├── index.html              # Página principal
├── styles/
│   ├── main.css           # Estilos base e layout
│   └── components.css     # Componentes (botões, cards, etc)
├── scripts/
│   └── dashboard.js       # Lógica e interatividade
├── CLAUDE.md              # Instruções para Claude Code
├── ANNA_GUIDE.md          # Guia da agente Anna
└── README.md              # Este arquivo
```

## ✨ Funcionalidades Atuais

### 🔐 Autenticação
- Login com Supabase Auth
- Sessão persistente
- Proteção de rotas
- Multi-tenant (workspaces)

### 📊 Métricas do Dia
- ✅ Tarefas concluídas (com tendência)
- ⚠️ Tarefas precisando atenção
- 📋 Tarefas em fila
- 📈 Métricas em tempo real do banco

### 🤖 Mesa de Trabalho
- 🎨 3 agentes especializados (Anna, Nick, Lucas)
- 🟢 Status em tempo real (Ativo/Ocioso)
- 💬 Chat integrado com Claude API
- 📝 System prompts personalizados por agente
- 🔄 Realtime updates com Supabase

### 📋 Tarefas
- 📝 CRUD completo de tarefas
- 👤 Atribuição a agentes
- ⏱️ Rastreamento de tempo
- 🔔 Alertas e notificações
- 📊 Histórico de atividades

### 💬 Chat com Agentes
- 🤖 Respostas reais via Claude API
- 💾 Histórico persistente no banco
- 🔄 Contexto de conversação
- 🎭 Personalidades distintas por agente

### ⚙️ Ações Disponíveis
- ➕ Criar nova tarefa
- 🤖 Criar novo agente
- 💬 Chat em tempo real
- 👁️ Ver detalhes e histórico
- 🚪 Logout seguro

## 🎨 Decisões de UX/UI

### Hierarquia Visual
1. **Métricas no topo** - Visão rápida do status geral
2. **Mesa de Trabalho central** - Protagonista da interface
3. **Tarefas em andamento** - Contexto do que acontece
4. **Ações sempre visíveis** - Header fixo com botões principais

### Feedback Visual
- 🟢 Indicadores de status animados
- 🔵 Pulse em agentes ativos
- ⚠️ Shake sutil em alertas
- ✨ Micro-animações em hover

### Estados
- ✅ Ativo - Verde com animação
- ⭕ Ocioso - Cinza opaco
- ⚠️ Atenção - Amarelo com destaque
- ⏳ Em progresso - Azul

### Responsividade
- 📱 Mobile-first
- 💻 Desktop otimizado
- 🖥️ Layouts adaptáveis por Grid CSS

## 🔮 Roadmap

### ✅ Fase 1 (Completa)
- [x] Sistema multi-agente (Anna, Nick, Lucas)
- [x] Chat com Claude API
- [x] Autenticação Supabase
- [x] Database PostgreSQL completo
- [x] Deploy Firebase + GitHub

### Fase 2 (Próxima)
- [ ] Backend proxy para Claude API (segurança)
- [ ] Notificações push
- [ ] Gráficos de produtividade
- [ ] Timeline de atividades
- [ ] Anexos em tarefas

### Fase 3 (Futuro)
- [ ] Analytics avançado
- [ ] Sugestões automáticas de otimização
- [ ] PWA (Progressive Web App)
- [ ] Modo escuro
- [ ] Integração Slack/Discord

## 🛠️ Tecnologias

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Grid, Flexbox, Animações, Variáveis CSS
- **JavaScript (Vanilla)** - Sem dependências
- **Design System** - Tokens de design consistentes

### Backend & APIs
- **Supabase** - Database PostgreSQL, Auth, Realtime
- **Claude API (Anthropic)** - Integração com modelos Claude 4
- **Firebase Hosting** - Deploy e CDN

### Agentes
- **Anna** - UX/UI Expert
- **Nick** - Database Architect
- **Lucas** - Backend Developer

## 🎯 Princípios de Design Aplicados

1. **Simplicidade** - Apenas o essencial, sem ruído visual
2. **Hierarquia Clara** - Importância visual = Importância funcional
3. **Feedback Imediato** - Usuário sempre sabe o que está acontecendo
4. **Consistência** - Padrões visuais e comportamentais
5. **Eficiência** - Mínimo de cliques para qualquer ação

## 🧪 Testes Recomendados

- [x] Abertura em navegadores (Chrome, Firefox, Safari, Edge)
- [ ] Responsividade em diferentes telas
- [ ] Acessibilidade (navegação por teclado)
- [ ] Performance (tempo de carregamento)

## 📝 Notas

- **Backend Supabase**: Dados persistentes com PostgreSQL
- **Autenticação JWT**: Sistema seguro multi-usuário
- **Claude API**: Requer API key (configure em `config/claude-api.js`)
- **Sem build process**: Arquivos servidos diretamente
- **Deploy automático**: Firebase Hosting com GitHub sync

## 👩‍🎨 Créditos

- **Design & Desenvolvimento**: Anna (Agente UX/UI)
- **Sistema**: i.Andre v1.0.0
- **Data**: 2026-02-23

## 📧 Próximos Passos

1. Abra `index.html` no navegador
2. Explore as funcionalidades
3. Teste criar nova tarefa
4. Teste criar novo agente
5. Interaja com os cards (hover, click)

**Divirta-se gerenciando seus agentes! 🚀**
