-- ============================================
-- i.andre - Dados Iniciais (Seed)
-- Database Architecture by Nick
-- ============================================

-- IMPORTANTE: Execute este script APÓS criar um usuário no Supabase Auth
-- Substitua 'SEU_USER_ID' pelo ID do usuário criado

-- ============================================
-- 1. CRIAR WORKSPACE PADRÃO
-- ============================================

-- Inserir workspace padrão (substitua o proprietario_id pelo seu user ID)
INSERT INTO espacos_trabalho (nome, proprietario_id, configuracoes)
VALUES (
  'Meu Espaço de Trabalho',
  auth.uid(), -- Usa o usuário atual autenticado
  '{
    "tema": "claro",
    "notificacoes": true,
    "idioma": "pt-BR"
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. CRIAR AGENTES PADRÃO
-- ============================================

-- Anna - Especialista em UX/UI
INSERT INTO agentes (
  espaco_trabalho_id,
  nome,
  slug,
  avatar,
  papel,
  status,
  atividade_atual,
  prompt_sistema,
  capacidades,
  configuracao
)
SELECT
  id,
  'Anna',
  'anna',
  '🎨',
  'ux',
  'ocioso',
  'Aguardando tarefa',
  'Você é Anna, especialista em UX/UI Design. Foque em experiência do usuário, interfaces intuitivas, conversões e acessibilidade. Sempre priorize simplicidade e clareza.',
  '[
    "auditoria_ux",
    "design_interface",
    "fluxos_usuario",
    "acessibilidade",
    "otimizacao_conversao",
    "microcopy",
    "design_system"
  ]'::jsonb,
  '{
    "modelo_ia": "claude-sonnet-4",
    "temperatura": 0.7,
    "max_tokens": 4000
  }'::jsonb
FROM espacos_trabalho
WHERE proprietario_id = auth.uid()
LIMIT 1
ON CONFLICT (espaco_trabalho_id, slug) DO NOTHING;

-- Nick - Especialista em Database
INSERT INTO agentes (
  espaco_trabalho_id,
  nome,
  slug,
  avatar,
  papel,
  status,
  atividade_atual,
  prompt_sistema,
  capacidades,
  configuracao
)
SELECT
  id,
  'Nick',
  'nick',
  '🗄️',
  'database',
  'ocioso',
  'Aguardando tarefa',
  'Você é Nick, especialista em Database Architecture. Foque em modelagem de dados, performance, escalabilidade e integridade. Sempre pense em evolução futura.',
  '[
    "design_schema",
    "migracoes",
    "otimizacao_queries",
    "modelagem_dados",
    "estrategias_multi_tenant",
    "particionamento",
    "indexacao"
  ]'::jsonb,
  '{
    "modelo_ia": "claude-sonnet-4",
    "temperatura": 0.5,
    "max_tokens": 4000
  }'::jsonb
FROM espacos_trabalho
WHERE proprietario_id = auth.uid()
LIMIT 1
ON CONFLICT (espaco_trabalho_id, slug) DO NOTHING;

-- Lucas - Especialista em Backend
INSERT INTO agentes (
  espaco_trabalho_id,
  nome,
  slug,
  avatar,
  papel,
  status,
  atividade_atual,
  prompt_sistema,
  capacidades,
  configuracao
)
SELECT
  id,
  'Lucas',
  'lucas',
  '💻',
  'backend',
  'ocioso',
  'Aguardando tarefa',
  'Você é Lucas, especialista em Backend Development. Foque em APIs robustas, lógica de negócio, integrações e segurança. Sempre garanta contratos claros.',
  '[
    "design_api",
    "logica_negocio",
    "integracoes",
    "seguranca",
    "autenticacao",
    "middleware",
    "testes"
  ]'::jsonb,
  '{
    "modelo_ia": "claude-sonnet-4",
    "temperatura": 0.6,
    "max_tokens": 4000
  }'::jsonb
FROM espacos_trabalho
WHERE proprietario_id = auth.uid()
LIMIT 1
ON CONFLICT (espaco_trabalho_id, slug) DO NOTHING;

-- ============================================
-- 3. CRIAR TAREFAS DE EXEMPLO (OPCIONAL)
-- ============================================

-- Tarefa de exemplo para Anna
INSERT INTO tarefas (
  espaco_trabalho_id,
  agente_id,
  criado_por,
  titulo,
  descricao,
  status,
  prioridade,
  contexto
)
SELECT
  e.id,
  a.id,
  auth.uid(),
  'Analisar interface do dashboard',
  'Revisar a interface do dashboard atual e identificar melhorias de UX',
  'fila',
  0,
  '{
    "tipo": "analise",
    "componente": "dashboard"
  }'::jsonb
FROM espacos_trabalho e
JOIN agentes a ON a.espaco_trabalho_id = e.id AND a.slug = 'anna'
WHERE e.proprietario_id = auth.uid()
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. VERIFICAR DADOS CRIADOS
-- ============================================

-- Listar workspaces criados
SELECT
  id,
  nome,
  criado_em
FROM espacos_trabalho
WHERE proprietario_id = auth.uid();

-- Listar agentes criados
SELECT
  a.nome,
  a.papel,
  a.status,
  a.avatar
FROM agentes a
JOIN espacos_trabalho e ON e.id = a.espaco_trabalho_id
WHERE e.proprietario_id = auth.uid();

-- Listar tarefas criadas
SELECT
  t.titulo,
  a.nome as agente,
  t.status
FROM tarefas t
JOIN agentes a ON a.id = t.agente_id
JOIN espacos_trabalho e ON e.id = t.espaco_trabalho_id
WHERE e.proprietario_id = auth.uid();

-- ============================================
-- FIM DO SEED
-- ============================================
