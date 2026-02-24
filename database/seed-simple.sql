-- ============================================
-- i.andre - Dados Iniciais SIMPLIFICADO
-- Executa sem precisar de login de usuário
-- Database Architecture by Nick
-- ============================================

-- Criar um usuário de teste primeiro
DO $$
DECLARE
  v_user_id UUID;
  v_workspace_id UUID;
BEGIN
  -- Criar usuário de teste se não existir
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@iandre.com',
    crypt('senha123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    'authenticated',
    'authenticated'
  )
  ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
  RETURNING id INTO v_user_id;

  -- Se já existe, pegar o ID
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@iandre.com';
  END IF;

  -- Criar workspace
  INSERT INTO espacos_trabalho (nome, proprietario_id, configuracoes)
  VALUES (
    'Meu Espaço de Trabalho',
    v_user_id,
    '{"tema": "claro", "notificacoes": true, "idioma": "pt-BR"}'::jsonb
  )
  RETURNING id INTO v_workspace_id;

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
    'Você é Anna, especialista em UX/UI Design.',
    '["auditoria_ux", "design_interface", "fluxos_usuario"]'::jsonb,
    '{"modelo_ia": "claude-sonnet-4", "temperatura": 0.7}'::jsonb
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
    'Você é Nick, especialista em Database Architecture.',
    '["design_schema", "migracoes", "otimizacao_queries"]'::jsonb,
    '{"modelo_ia": "claude-sonnet-4", "temperatura": 0.5}'::jsonb
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
    'Você é Lucas, especialista em Backend Development.',
    '["design_api", "logica_negocio", "integracoes"]'::jsonb,
    '{"modelo_ia": "claude-sonnet-4", "temperatura": 0.6}'::jsonb
  );

  -- Tarefa de exemplo
  INSERT INTO tarefas (
    espaco_trabalho_id, agente_id, criado_por, titulo, descricao, status, prioridade
  )
  SELECT
    v_workspace_id,
    a.id,
    v_user_id,
    'Analisar interface do dashboard',
    'Revisar a interface do dashboard atual e identificar melhorias de UX',
    'fila',
    0
  FROM agentes a
  WHERE a.espaco_trabalho_id = v_workspace_id AND a.slug = 'anna';

  -- Mostrar resumo
  RAISE NOTICE 'Usuário criado: admin@iandre.com (senha: senha123)';
  RAISE NOTICE 'Workspace ID: %', v_workspace_id;
  RAISE NOTICE 'User ID: %', v_user_id;
END $$;

-- Verificar dados criados
SELECT 'Workspaces criados:' as tipo;
SELECT id, nome, criado_em FROM espacos_trabalho;

SELECT 'Agentes criados:' as tipo;
SELECT nome, papel, status, avatar FROM agentes;

SELECT 'Tarefas criadas:' as tipo;
SELECT t.titulo, a.nome as agente, t.status
FROM tarefas t
JOIN agentes a ON a.id = t.agente_id;
