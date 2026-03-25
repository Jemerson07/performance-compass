# PerformanceAI - Sistema de Gestão Inteligente de Performance

Sistema completo de gestão de performance com IA integrada, análise de currículos, distribuição de tarefas e funcionalidade offline.

## Funcionalidades Principais

### Para Gestores
- Criação e gerenciamento de colaboradores
- Upload e análise automática de currículos em PDF com IA
- Atribuição manual de contratos e veículos
- Dashboard com métricas e alertas de sobrecarga
- Sistema de redistribuição de tarefas
- Análises avançadas e previsões com ML
- Mapa de competências da equipe

### Para Colaboradores
- Dashboard pessoal com estatísticas
- Registro de atividades
- Sistema de gamificação (níveis, XP, badges)
- Visualização de competências
- Acesso ao assistente IA

### Recursos Avançados
- Aplicativo PWA instalável (desktop e mobile)
- Funcionalidade offline completa com sincronização automática
- Assistente IA integrado com chat contextual
- Análise automática de currículos e extração de competências
- Alertas inteligentes de sobrecarga
- Radar de habilidades interativo

## Início Rápido

### Pré-requisitos
- Node.js 18+ ou Bun
- Conta Supabase configurada
- Arquivo `.env` com credenciais

### Instalação

```bash
npm install
npm run dev
```

O sistema estará disponível em `http://localhost:8080`

### Primeiro Uso

1. Acesse o sistema e crie uma conta de **Gestor**
2. Vá em **Colaboradores** e crie seus primeiros colaboradores
3. Faça upload dos currículos em PDF para análise da IA
4. Em **Atribuições**, adicione contratos e veículos aos colaboradores
5. Monitore a equipe no **Dashboard**

Para instruções detalhadas, consulte `PRIMEIRO_USO.md`

## Estrutura do Projeto

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── charts/         # Gráficos (Recharts)
│   ├── chat/           # Assistente IA
│   ├── dashboard/      # Widgets do dashboard
│   └── layout/         # Layout e navegação
├── contexts/           # Contextos React (AppContext)
├── hooks/              # Hooks personalizados (useAuth)
├── integrations/       # Integração Supabase
├── lib/                # Utilitários e offline queue
├── pages/              # Páginas principais
│   ├── Index.tsx              # Router principal
│   ├── AuthPage.tsx           # Login/Cadastro
│   ├── EmployeeDashboard.tsx  # Dashboard colaborador
│   ├── ManagerDashboard.tsx   # Dashboard gestor
│   ├── TaskAssignmentPage.tsx # Atribuição de tarefas
│   ├── EmployeeManagementPage.tsx # Gestão de colaboradores
│   ├── TeamPage.tsx           # Página da equipe
│   ├── MindMapPage.tsx        # Mapa de competências
│   └── AnalyticsPage.tsx      # Análises avançadas
└── types/              # Tipos TypeScript

supabase/
└── migrations/         # Migrações do banco de dados
```

## Banco de Dados

O sistema utiliza **Supabase** (PostgreSQL) com as seguintes tabelas principais:

- `employees` - Dados dos colaboradores
- `profiles` - Perfis de usuários
- `user_roles` - Permissões (manager/employee)
- `contracts` - Contratos atribuídos
- `vehicles` - Veículos gerenciados
- `curriculum_files` - Currículos em PDF
- `ai_analysis` - Análises da IA
- `task_assignments` - Histórico de atribuições
- `task_support_requests` - Solicitações de apoio
- `offline_queue` - Fila de sincronização offline
- `skills` - Competências dos colaboradores

Todas as tabelas possuem **Row Level Security (RLS)** configurado.

## Tecnologias

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Animações**: Framer Motion
- **Gráficos**: Recharts
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **PWA**: Vite PWA Plugin + Workbox
- **Offline**: LocalStorage + IndexedDB

## Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificar código
npm test             # Executar testes
```

## Instalação como App

### Desktop
1. Abra o sistema no navegador (Chrome/Edge/Brave)
2. Clique no ícone de instalação na barra de endereço
3. Ou aguarde o prompt automático
4. Clique em "Instalar Aplicativo"

### Mobile
- **Android**: Menu → "Adicionar à tela inicial"
- **iOS**: Compartilhar → "Adicionar à Tela de Início"

## Funcionalidade Offline

O sistema funciona completamente offline:

- Todas as operações são armazenadas localmente
- Sincronização automática quando online
- Indicador visual de status de conexão
- Contador de operações pendentes
- Cache inteligente de dados e recursos

## Documentação

- `MANUAL_DO_SISTEMA.md` - Manual completo de uso
- `GUIA_DE_TESTE.md` - Checklist de testes (35 casos)
- `PRIMEIRO_USO.md` - Guia de início rápido
- `RESUMO_COMPLETO.md` - Resumo técnico completo

## Suporte

Use o **Assistente IA** integrado no sistema para:
- Tirar dúvidas sobre funcionalidades
- Obter recomendações personalizadas
- Analisar dados da equipe
- Receber dicas de produtividade

## Segurança

- Autenticação Supabase
- Row Level Security (RLS) em todas as tabelas
- Gestores só veem dados da equipe
- Colaboradores só veem próprios dados
- Currículos protegidos por RLS
- HTTPS obrigatório em produção

## Licença

Desenvolvido por Jemerson - Sistema proprietário
