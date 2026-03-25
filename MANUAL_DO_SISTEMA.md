# PerformanceAI - Manual do Sistema

## Sistema Completo de Gestão de Performance com IA

### Funcionalidades Implementadas

#### 1. Sistema de Autenticação
- Login com email e senha
- Registro de novos usuários
- Dois níveis de acesso: Gestor e Colaborador
- Proteção de rotas por permissão

#### 2. Gestão de Colaboradores (Apenas Gestores)
- Criar novos colaboradores com email, nome e cargo
- Upload de currículos em PDF
- Análise automática de currículos com IA
- Extração de competências do currículo
- Exclusão de colaboradores
- Avatares personalizáveis

#### 3. Atribuição de Tarefas e Cargas (Apenas Gestores)
- Visualização de todos os colaboradores
- Atribuição de contratos aos colaboradores
- Atribuição de veículos aos colaboradores
- Adição manual de contratos (número, cliente, valor, datas)
- Adição manual de veículos (placa, marca, modelo, ano)
- Remoção de contratos e veículos
- Contador automático de contratos e veículos por colaborador
- Alerta visual para colaboradores sobrecarregados

#### 4. Dashboard do Gestor
- Visão geral da equipe
- Métricas consolidadas (tarefas/semana, tempo médio, precisão)
- Alertas de sobrecarga automáticos
- Recomendações de redistribuição de tarefas com IA
- Gráficos de desempenho semanal
- Radar de competências da equipe
- Sistema de redistribuição de tarefas

#### 5. Dashboard do Colaborador
- Estatísticas pessoais de performance
- Lista de tarefas atribuídas
- Formulário de entrada de dados manual
- Radar de competências individuais
- Sistema de gamificação (níveis, XP, badges)
- Gráficos de produtividade semanal
- Dicas personalizadas da IA

#### 6. Análise de Competências
- Mapa visual de habilidades (radar chart)
- 6 categorias: Comunicação, Análise, Execução, Autonomia, Liderança, Técnico
- Identificação de pontos fortes
- Identificação de áreas para desenvolvimento
- Análise baseada em currículos enviados

#### 7. Análises Avançadas (Apenas Gestores)
- Comparação de carga entre colaboradores
- Análise de origem das demandas
- Previsões de demanda com ML
- Insights automáticos da IA
- Detecção de padrões e tendências

#### 8. Sistema de IA Integrado
- Chat com assistente IA sempre disponível
- Análise de currículos em PDF
- Extração automática de competências
- Recomendações de distribuição de tarefas
- Alertas de sobrecarga
- Sugestões de produtividade personalizadas
- Análise de perfil baseada em dados

#### 9. Funcionalidade Offline
- Aplicativo PWA instalável
- Funciona offline em desktop e mobile
- Sincronização automática quando online
- Fila de operações offline
- Indicador visual de status online/offline
- Cache inteligente de dados

#### 10. Sistema de Suporte entre Colaboradores
- Solicitações de apoio entre membros da equipe
- Aprovação de suporte pelo gestor
- Histórico de redistribuições
- Transferência parcial de carga

### Como Usar

#### Para Gestores

1. **Primeiro Acesso**
   - Faça login como gestor
   - Acesse "Colaboradores" no menu lateral
   - Clique em "Novo Colaborador"
   - Preencha: email, senha inicial, nome completo e cargo
   - Escolha um avatar
   - Clique em "Criar Colaborador"

2. **Upload de Currículos**
   - Na página "Colaboradores"
   - Clique em "Enviar CV" no card do colaborador
   - Selecione um arquivo PDF
   - Clique em "Enviar e Analisar com IA"
   - O sistema automaticamente extrairá competências

3. **Atribuir Contratos e Veículos**
   - Acesse "Atribuições" no menu
   - Selecione um colaborador na lista
   - Para contratos: clique no "+" em Contratos
   - Preencha: número do contrato, cliente, valor (opcional)
   - Para veículos: clique no "+" em Veículos
   - Preencha: placa (obrigatório), marca, modelo, ano
   - Os contadores são atualizados automaticamente

4. **Gerenciar Sobrecarga**
   - Colaboradores com carga > 100% aparecem com alerta
   - No Dashboard, veja recomendações da IA
   - Use "Redistribuição de Tarefas" para mover cargas
   - Selecione colaborador sobrecarregado
   - Escolha tarefa e colaborador disponível
   - Confirme redistribuição

5. **Análises**
   - Acesse "Análises" para ver métricas avançadas
   - Veja comparações de carga por colaborador
   - Analise origem das demandas
   - Confira previsões de demanda

#### Para Colaboradores

1. **Visualizar Dashboard**
   - Veja suas estatísticas pessoais
   - Acompanhe tarefas atribuídas
   - Monitore seu progresso de XP e nível

2. **Registrar Atividades**
   - Use "Registrar Atividade" no dashboard
   - Preencha descrição, origem, prioridade
   - Defina tempo estimado e tempo real
   - Salve a atividade

3. **Acompanhar Competências**
   - Acesse "Competências" no menu
   - Veja seu radar de habilidades
   - Identifique áreas fortes e a desenvolver

4. **Usar Assistente IA**
   - Clique em "Assistente IA" no menu
   - Faça perguntas sobre produtividade
   - Peça análises e recomendações
   - Use sugestões rápidas

### Instalação como App

#### Desktop
1. Abra o sistema no navegador (Chrome, Edge, ou Brave)
2. Procure o ícone de instalação na barra de endereço
3. Ou clique no prompt que aparece no canto inferior
4. Clique em "Instalar"
5. O app ficará disponível como aplicativo nativo

#### Mobile
1. Abra o sistema no navegador mobile (Chrome ou Safari)
2. No Chrome: Menu → "Adicionar à tela inicial"
3. No Safari: Compartilhar → "Adicionar à Tela de Início"
4. O app funcionará como aplicativo nativo

### Funcionalidade Offline

O sistema funciona completamente offline:

1. **Sincronização Automática**
   - Todas as operações offline são armazenadas localmente
   - Quando a conexão retorna, sincroniza automaticamente
   - Contador de operações pendentes visível

2. **Indicador de Status**
   - Verde = Online e sincronizado
   - Amarelo = Offline com operações pendentes
   - Número mostra quantas operações estão na fila

3. **Dados em Cache**
   - Dados visualizados recentemente ficam em cache
   - Imagens e recursos estáticos são armazenados
   - Funcionalidade completa mesmo sem internet

### Estrutura do Banco de Dados

O sistema utiliza Supabase com as seguintes tabelas:

- **employees**: Dados dos colaboradores
- **profiles**: Perfis de usuários (nome, cargo, avatar)
- **user_roles**: Permissões (manager/employee)
- **tasks**: Tarefas do sistema
- **contracts**: Contratos atribuídos
- **vehicles**: Veículos gerenciados
- **curriculum_files**: Currículos em PDF
- **ai_analysis**: Análises de IA
- **task_assignments**: Histórico de atribuições
- **task_support_requests**: Solicitações de apoio
- **offline_queue**: Fila de sincronização
- **skills**: Competências dos colaboradores

### Segurança

- Row Level Security (RLS) em todas as tabelas
- Gestores só veem dados da equipe
- Colaboradores só veem próprios dados
- Currículos protegidos
- Autenticação Supabase segura

### Suporte e Dúvidas

Use o Assistente IA integrado para:
- Tirar dúvidas sobre funcionalidades
- Obter recomendações personalizadas
- Analisar dados da equipe
- Receber dicas de produtividade

### Próximas Funcionalidades

O sistema é extensível e pode receber:
- Integração com outras ferramentas (Excel, Google Sheets)
- Notificações push
- Relatórios em PDF
- Exportação de dados
- Gráficos personalizados
- Metas e OKRs
