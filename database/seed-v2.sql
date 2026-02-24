-- ============================================
-- i.andre - Dados Iniciais V2
-- Funciona com usuário criado via Supabase Auth
-- Database Architecture by Nick
-- ============================================

-- IMPORTANTE: Antes de executar este script:
-- 1. Crie um usuário no Supabase Auth Dashboard
-- 2. Ou use este script para criar via Auth API

-- ============================================
-- OPÇÃO 1: Criar usuário via Auth API
-- Execute este bloco separadamente primeiro
-- ============================================

-- Descomente e execute se quiser criar usuário programaticamente:
/*
SELECT extensions.create_user(
  'admin@iandre.com',  -- email
  'senha123',           -- senha
  true                  -- email_confirmed
);
*/

-- ============================================
-- OPÇÃO 2: Seed com usuário existente
-- Execute após ter um usuário criado
-- ============================================

DO $$
DECLARE
  v_user_id UUID;
  v_workspace_id UUID;
BEGIN
  -- Pegar o primeiro usuário disponível
  -- Se você estiver logado, use auth.uid() em vez disso
  SELECT id INTO v_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;

  -- Se não encontrou usuário, abortar
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum usuário encontrado! Crie um usuário primeiro no Auth Dashboard.';
  END IF;

  RAISE NOTICE 'Usando usuário ID: %', v_user_id;

  -- Criar workspace
  INSERT INTO espacos_trabalho (nome, proprietario_id, configuracoes)
  VALUES (
    'Meu Espaço de Trabalho',
    v_user_id,
    '{"tema": "claro", "notificacoes": true, "idioma": "pt-BR"}'::jsonb
  )
  RETURNING id INTO v_workspace_id;

  RAISE NOTICE 'Workspace criado: %', v_workspace_id;

  -- Criar Agente: Anna
  INSERT INTO agentes (
    espaco_trabalho_id, nome, slug, avatar, papel, status, atividade_atual,
    prompt_sistema, capacidades, configuracao
  ) VALUES (
    v_workspace_id,
    'Anna',
    'anna',
    '🎨',
    'ux',
    'ocioso',
    'Aguardando tarefa',
    'Você é Anna, especialista em UX/UI Design. Foque em experiência do usuário, interfaces intuitivas, conversões e acessibilidade.',
    '["auditoria_ux", "design_interface", "fluxos_usuario", "acessibilidade", "otimizacao_conversao"]'::jsonb,
    '{"modelo_ia": "claude-sonnet-4", "temperatura": 0.7, "max_tokens": 4000}'::jsonb
  );

  -- Criar Agente: Nick
  INSERT INTO agentes (
    espaco_trabalho_id, nome, slug, avatar, papel, status, atividade_atual,
    prompt_sistema, capacidades, configuracao
  ) VALUES (
    v_workspace_id,
    'Nick',
    'nick',
    '🗄️',
    'database',
    'ocioso',
    'Aguardando tarefa',
    'Você é Nick, especialista em Database Architecture. Foque em modelagem, performance, escalabilidade e integridade.',
    '["design_schema", "migracoes", "otimizacao_queries", "modelagem_dados", "indexacao"]'::jsonb,
    '{"modelo_ia": "claude-sonnet-4", "temperatura": 0.5, "max_tokens": 4000}'::jsonb
  );

  -- Criar Agente: Lucas
  INSERT INTO agentes (
    espaco_trabalho_id, nome, slug, avatar, papel, status, atividade_atual,
    prompt_sistema, capacidades, configuracao
  ) VALUES (
    v_workspace_id,
    'Lucas',
    'lucas',
    '💻',
    'backend',
    'ocioso',
    'Aguardando tarefa',
    'Você é Lucas, especialista em Backend Development. Foque em APIs robustas, lógica de negócio, integrações e segurança.',
    '["design_api", "logica_negocio", "integracoes", "seguranca", "autenticacao"]'::jsonb,
    '{"modelo_ia": "claude-sonnet-4", "temperatura": 0.6, "max_tokens": 4000}'::jsonb
  );

  -- Tarefa de exemplo para Anna
  INSERT INTO tarefas (
    espaco_trabalho_id, agente_id, criado_por, titulo, descricao, status, prioridade, contexto
  )
  SELECT
    v_workspace_id,
    a.id,
    v_user_id,
    'Analisar interface do dashboard',
    'Revisar a interface do dashboard atual e identificar melhorias de UX',
    'fila',
    0,
    '{"tipo": "analise", "componente": "dashboard"}'::jsonb
  FROM agentes a
  WHERE a.espaco_trabalho_id = v_workspace_id AND a.slug = 'anna';

  RAISE NOTICE '✅ Dados criados com sucesso!';
  RAISE NOTICE 'Workspace: Meu Espaço de Trabalho';
  RAISE NOTICE 'Agentes: Anna, Nick, Lucas';
  RAISE NOTICE 'Tarefas: 1 tarefa de exemplo';

END $$;

-- ============================================
-- VERIFICAÇÕES
-- ============================================

-- Listar workspaces
SELECT
  '🏢 WORKSPACES' as "═══════════════════";

SELECT
  id,
  nome,
  TO_CHAR(criado_em, 'DD/MM/YYYY HH24:MI') as criado_em
FROM espacos_trabalho
ORDER BY criado_em DESC;

-- Listar agentes
SELECT
  '👥 AGENTES' as "═══════════════════";

SELECT
  avatar || ' ' || nome as agente,
  papel,
  status,
  tarefas_concluidas,
  TO_CHAR(criado_em, 'DD/MM/YYYY HH24:MI') as criado_em
FROM agentes
ORDER BY nome;

-- Listar tarefas
SELECT
  '📋 TAREFAS' as "═══════════════════";

SELECT
  t.titulo,
  a.nome as agente,
  t.status,
  t.prioridade,
  TO_CHAR(t.criado_em, 'DD/MM/YYYY HH24:MI') as criado_em
FROM tarefas t
JOIN agentes a ON a.id = t.agente_id
ORDER BY t.criado_em DESC;

-- Estatísticas
SELECT
  '📊 ESTATÍSTICAS' as "═══════════════════";

SELECT
  (SELECT COUNT(*) FROM espacos_trabalho) as total_workspaces,
  (SELECT COUNT(*) FROM agentes) as total_agentes,
  (SELECT COUNT(*) FROM tarefas) as total_tarefas,
  (SELECT COUNT(*) FROM mensagens) as total_mensagens;
