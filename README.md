# i.Andre - Sistema de Gerenciamento de Agentes AI

Sistema pessoal para gerenciar agentes AI que auxiliam nas atividades do ClubPetro.

## 🚀 Como Usar

### Abertura Rápida

1. **Abrir no navegador:**
   - Clique duas vezes em `index.html` OU
   - Arraste `index.html` para o navegador OU
   - Use Live Server no VS Code

2. **Via servidor local (opcional):**
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (http-server)
   npx http-server
   ```

   Depois acesse: `http://localhost:8000`

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

### Métricas do Dia
- ✅ Tarefas concluídas (com tendência)
- ⚠️ Tarefas precisando atenção
- 📋 Tarefas em fila

### Mesa de Trabalho
- 🎨 Visualização de agentes
- 🟢 Status em tempo real (Ativo/Ocioso)
- 💬 Atividade atual de cada agente
- ➕ Adicionar novos agentes

### Tarefas
- 📝 Lista de tarefas em andamento
- 👤 Atribuição a agentes
- ⏱️ Tempo de execução
- 🔔 Alertas de tarefas que precisam atenção

### Ações Disponíveis
- ➕ Criar nova tarefa
- 🤖 Criar novo agente
- ⚙️ Configurações
- 👁️ Ver detalhes de agentes e tarefas

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

### Fase 2 (Próxima)
- [ ] Notificações push
- [ ] Gráficos de produtividade
- [ ] Busca e filtros avançados
- [ ] Timeline de atividades
- [ ] Drag & drop para reatribuir tarefas

### Fase 3 (Futuro)
- [ ] Chat direto com agentes
- [ ] Analytics avançado
- [ ] Sugestões automáticas de otimização
- [ ] PWA (Progressive Web App)
- [ ] Integração com APIs externas
- [ ] Modo escuro

## 🛠️ Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Grid, Flexbox, Animações, Variáveis CSS
- **JavaScript (Vanilla)** - Sem dependências
- **Design System** - Tokens de design consistentes

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

- **Sem backend**: Dados armazenados em memória (não persiste ao recarregar)
- **Sem autenticação**: Sistema de uso pessoal
- **Sem build process**: Arquivos servidos diretamente

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
