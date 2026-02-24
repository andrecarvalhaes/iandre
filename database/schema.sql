-- ============================================
-- i.andre - Schema Completo em Português
-- Database Architecture by Nick
-- ============================================

-- ============================================
-- 1. TABELAS PRINCIPAIS
-- ============================================

-- Perfis de Usuário (extensão do auth.users)
CREATE TABLE perfis_usuario (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_exibicao TEXT,
  url_avatar TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Espaços de Trabalho (Workspaces)
CREATE TABLE espacos_trabalho (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  proprietario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  configuracoes JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_espacos_trabalho_proprietario ON espacos_trabalho(proprietario_id);

-- Agentes
CREATE TABLE agentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  espaco_trabalho_id UUID REFERENCES espacos_trabalho(id) ON DELETE CASCADE,

  -- Identificação
  nome TEXT NOT NULL,
  slug TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '🤖',
  papel TEXT NOT NULL,

  -- Estado
  status TEXT NOT NULL DEFAULT 'ocioso',
  atividade_atual TEXT,

  -- Configuração
  prompt_sistema TEXT,
  capacidades JSONB DEFAULT '[]'::jsonb,
  configuracao JSONB DEFAULT '{}'::jsonb,

  -- Métricas
  tarefas_concluidas INTEGER DEFAULT 0,
  total_mensagens INTEGER DEFAULT 0,

  -- Timestamps
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  ultima_atividade_em TIMESTAMPTZ,

  UNIQUE(espaco_trabalho_id, slug)
);

CREATE INDEX idx_agentes_espaco_trabalho ON agentes(espaco_trabalho_id);
CREATE INDEX idx_agentes_status ON agentes(status);

-- Tarefas
CREATE TABLE tarefas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  espaco_trabalho_id UUID REFERENCES espacos_trabalho(id) ON DELETE CASCADE,
  agente_id UUID REFERENCES agentes(id) ON DELETE SET NULL,
  criado_por UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Conteúdo
  titulo TEXT NOT NULL,
  descricao TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'fila',
  prioridade INTEGER DEFAULT 0,

  -- Rastreamento
  iniciada_em TIMESTAMPTZ,
  concluida_em TIMESTAMPTZ,
  motivo_bloqueio TEXT,

  -- Contexto
  contexto JSONB DEFAULT '{}'::jsonb,
  resultado JSONB,

  -- Timestamps
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tarefas_espaco_trabalho ON tarefas(espaco_trabalho_id);
CREATE INDEX idx_tarefas_agente ON tarefas(agente_id);
CREATE INDEX idx_tarefas_status ON tarefas(status);
CREATE INDEX idx_tarefas_criado_por ON tarefas(criado_por);
CREATE INDEX idx_tarefas_prioridade ON tarefas(prioridade DESC);

-- Mensagens (Chat)
CREATE TABLE mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  espaco_trabalho_id UUID REFERENCES espacos_trabalho(id) ON DELETE CASCADE,
  agente_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
  tarefa_id UUID REFERENCES tarefas(id) ON DELETE SET NULL,

  -- Autoria
  tipo_remetente TEXT NOT NULL,
  remetente_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Conteúdo
  conteudo TEXT NOT NULL,
  tipo_conteudo TEXT DEFAULT 'texto',

  -- Metadata
  metadados JSONB DEFAULT '{}'::jsonb,

  -- Flags
  editada BOOLEAN DEFAULT false,
  deletada BOOLEAN DEFAULT false,

  -- Timestamps
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mensagens_espaco_trabalho ON mensagens(espaco_trabalho_id);
CREATE INDEX idx_mensagens_agente ON mensagens(agente_id);
CREATE INDEX idx_mensagens_tarefa ON mensagens(tarefa_id);
CREATE INDEX idx_mensagens_criado_em ON mensagens(criado_em DESC);

-- Atividades de Tarefa (Histórico)
CREATE TABLE atividades_tarefa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tarefa_id UUID REFERENCES tarefas(id) ON DELETE CASCADE,

  -- Evento
  tipo_evento TEXT NOT NULL,
  tipo_ator TEXT NOT NULL,
  ator_id UUID,

  -- Detalhes
  descricao TEXT,
  metadados JSONB DEFAULT '{}'::jsonb,

  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_atividades_tarefa_tarefa ON atividades_tarefa(tarefa_id);
CREATE INDEX idx_atividades_tarefa_criado_em ON atividades_tarefa(criado_em DESC);

-- Histórico de Agentes
CREATE TABLE historico_agentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agente_id UUID REFERENCES agentes(id) ON DELETE CASCADE,

  -- Mudança de estado
  status_anterior TEXT,
  status_novo TEXT,
  atividade_anterior TEXT,
  atividade_nova TEXT,

  -- Contexto
  motivo TEXT,
  metadados JSONB DEFAULT '{}'::jsonb,

  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_historico_agentes_agente ON historico_agentes(agente_id);
CREATE INDEX idx_historico_agentes_criado_em ON historico_agentes(criado_em DESC);

-- Anexos
CREATE TABLE anexos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  espaco_trabalho_id UUID REFERENCES espacos_trabalho(id) ON DELETE CASCADE,
  tarefa_id UUID REFERENCES tarefas(id) ON DELETE CASCADE,
  mensagem_id UUID REFERENCES mensagens(id) ON DELETE CASCADE,

  -- Arquivo
  nome_arquivo TEXT NOT NULL,
  tipo_arquivo TEXT NOT NULL,
  tamanho_arquivo INTEGER,
  caminho_storage TEXT NOT NULL,

  -- Metadata
  enviado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadados JSONB DEFAULT '{}'::jsonb,

  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_anexos_tarefa ON anexos(tarefa_id);
CREATE INDEX idx_anexos_mensagem ON anexos(mensagem_id);

-- ============================================
-- 2. VIEWS
-- ============================================

-- Estatísticas dos Agentes
CREATE VIEW estatisticas_agentes AS
SELECT
  a.id,
  a.nome,
  a.status,
  COUNT(DISTINCT t.id) as total_tarefas,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'concluida') as tarefas_concluidas,
  COUNT(DISTINCT m.id) as total_mensagens,
  a.ultima_atividade_em
FROM agentes a
LEFT JOIN tarefas t ON t.agente_id = a.id
LEFT JOIN mensagens m ON m.agente_id = a.id
GROUP BY a.id;

-- Métricas do Workspace
CREATE VIEW metricas_espaco_trabalho AS
SELECT
  e.id as espaco_trabalho_id,
  COUNT(DISTINCT t.id) as total_tarefas,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'concluida') as tarefas_concluidas,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'atencao') as tarefas_atencao,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'fila') as tarefas_fila,
  COUNT(DISTINCT a.id) as total_agentes,
  COUNT(DISTINCT m.id) as total_mensagens
FROM espacos_trabalho e
LEFT JOIN tarefas t ON t.espaco_trabalho_id = e.id
LEFT JOIN agentes a ON a.espaco_trabalho_id = e.id
LEFT JOIN mensagens m ON m.espaco_trabalho_id = e.id
GROUP BY e.id;

-- ============================================
-- 3. FUNCTIONS & TRIGGERS
-- ============================================

-- Função: Atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualização automática
CREATE TRIGGER agentes_atualizado_em
  BEFORE UPDATE ON agentes
  FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER tarefas_atualizado_em
  BEFORE UPDATE ON tarefas
  FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER mensagens_atualizado_em
  BEFORE UPDATE ON mensagens
  FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER espacos_trabalho_atualizado_em
  BEFORE UPDATE ON espacos_trabalho
  FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

-- Função: Registrar mudanças de status de agentes
CREATE OR REPLACE FUNCTION registrar_mudanca_status_agente()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status OR
     OLD.atividade_atual IS DISTINCT FROM NEW.atividade_atual THEN

    INSERT INTO historico_agentes (
      agente_id,
      status_anterior,
      status_novo,
      atividade_anterior,
      atividade_nova
    )
    VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      OLD.atividade_atual,
      NEW.atividade_atual
    );

    NEW.ultima_atividade_em = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mudanca_status_agente
  BEFORE UPDATE ON agentes
  FOR EACH ROW EXECUTE FUNCTION registrar_mudanca_status_agente();

-- Função: Registrar atividades de tarefas
CREATE OR REPLACE FUNCTION registrar_atividade_tarefa()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO atividades_tarefa (tarefa_id, tipo_evento, tipo_ator, descricao)
    VALUES (NEW.id, 'criada', 'usuario', 'Tarefa criada');

  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO atividades_tarefa (
        tarefa_id,
        tipo_evento,
        tipo_ator,
        descricao,
        metadados
      )
      VALUES (
        NEW.id,
        'status_alterado',
        'sistema',
        'Status alterado de ' || OLD.status || ' para ' || NEW.status,
        jsonb_build_object('status_anterior', OLD.status, 'status_novo', NEW.status)
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_atividade_tarefa
  AFTER INSERT OR UPDATE ON tarefas
  FOR EACH ROW EXECUTE FUNCTION registrar_atividade_tarefa();

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE espacos_trabalho ENABLE ROW LEVEL SECURITY;
ALTER TABLE agentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE atividades_tarefa ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_agentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfis_usuario ENABLE ROW LEVEL SECURITY;

-- Políticas para perfis_usuario
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON perfis_usuario FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON perfis_usuario FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON perfis_usuario FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Políticas para espacos_trabalho
CREATE POLICY "Usuários veem seus espaços de trabalho"
  ON espacos_trabalho FOR SELECT
  USING (auth.uid() = proprietario_id);

CREATE POLICY "Usuários podem criar seus espaços"
  ON espacos_trabalho FOR INSERT
  WITH CHECK (auth.uid() = proprietario_id);

CREATE POLICY "Usuários podem atualizar seus espaços"
  ON espacos_trabalho FOR UPDATE
  USING (auth.uid() = proprietario_id);

-- Políticas para agentes
CREATE POLICY "Usuários veem agentes de seus espaços"
  ON agentes FOR SELECT
  USING (espaco_trabalho_id IN (
    SELECT id FROM espacos_trabalho WHERE proprietario_id = auth.uid()
  ));

CREATE POLICY "Usuários podem criar agentes em seus espaços"
  ON agentes FOR INSERT
  WITH CHECK (espaco_trabalho_id IN (
    SELECT id FROM espacos_trabalho WHERE proprietario_id = auth.uid()
  ));

CREATE POLICY "Usuários podem atualizar agentes de seus espaços"
  ON agentes FOR UPDATE
  USING (espaco_trabalho_id IN (
    SELECT id FROM espacos_trabalho WHERE proprietario_id = auth.uid()
  ));

-- Políticas para tarefas
CREATE POLICY "Usuários veem tarefas de seus espaços"
  ON tarefas FOR SELECT
  USING (espaco_trabalho_id IN (
    SELECT id FROM espacos_trabalho WHERE proprietario_id = auth.uid()
  ));

CREATE POLICY "Usuários criam tarefas em seus espaços"
  ON tarefas FOR INSERT
  WITH CHECK (espaco_trabalho_id IN (
    SELECT id FROM espacos_trabalho WHERE proprietario_id = auth.uid()
  ));

CREATE POLICY "Usuários atualizam tarefas de seus espaços"
  ON tarefas FOR UPDATE
  USING (espaco_trabalho_id IN (
    SELECT id FROM espacos_trabalho WHERE proprietario_id = auth.uid()
  ));

-- Políticas para mensagens
CREATE POLICY "Usuários veem mensagens de seus espaços"
  ON mensagens FOR SELECT
  USING (espaco_trabalho_id IN (
    SELECT id FROM espacos_trabalho WHERE proprietario_id = auth.uid()
  ));

CREATE POLICY "Usuários criam mensagens em seus espaços"
  ON mensagens FOR INSERT
  WITH CHECK (espaco_trabalho_id IN (
    SELECT id FROM espacos_trabalho WHERE proprietario_id = auth.uid()
  ));

CREATE POLICY "Usuários atualizam mensagens de seus espaços"
  ON mensagens FOR UPDATE
  USING (espaco_trabalho_id IN (
    SELECT id FROM espacos_trabalho WHERE proprietario_id = auth.uid()
  ));

-- Políticas para atividades_tarefa
CREATE POLICY "Usuários veem atividades de tarefas de seus espaços"
  ON atividades_tarefa FOR SELECT
  USING (tarefa_id IN (
    SELECT id FROM tarefas WHERE espaco_trabalho_id IN (
      SELECT id FROM espacos_trabalho WHERE proprietario_id = auth.uid()
    )
  ));

-- Políticas para historico_agentes
CREATE POLICY "Usuários veem histórico de agentes de seus espaços"
  ON historico_agentes FOR SELECT
  USING (agente_id IN (
    SELECT id FROM agentes WHERE espaco_trabalho_id IN (
      SELECT id FROM espacos_trabalho WHERE proprietario_id = auth.uid()
    )
  ));

-- Políticas para anexos
CREATE POLICY "Usuários veem anexos de seus espaços"
  ON anexos FOR SELECT
  USING (espaco_trabalho_id IN (
    SELECT id FROM espacos_trabalho WHERE proprietario_id = auth.uid()
  ));

CREATE POLICY "Usuários criam anexos em seus espaços"
  ON anexos FOR INSERT
  WITH CHECK (espaco_trabalho_id IN (
    SELECT id FROM espacos_trabalho WHERE proprietario_id = auth.uid()
  ));

-- ============================================
-- 5. COMENTÁRIOS PARA DOCUMENTAÇÃO
-- ============================================

COMMENT ON TABLE espacos_trabalho IS 'Workspaces/organizações dos usuários';
COMMENT ON TABLE agentes IS 'Agentes AI (Anna, Nick, Lucas) configurados';
COMMENT ON TABLE tarefas IS 'Tarefas atribuídas aos agentes';
COMMENT ON TABLE mensagens IS 'Mensagens do chat entre usuário e agentes';
COMMENT ON TABLE atividades_tarefa IS 'Log de todas atividades/mudanças em tarefas';
COMMENT ON TABLE historico_agentes IS 'Histórico de mudanças de status dos agentes';
COMMENT ON TABLE anexos IS 'Arquivos anexados a tarefas ou mensagens';

-- ============================================
-- FIM DO SCHEMA
-- ============================================
