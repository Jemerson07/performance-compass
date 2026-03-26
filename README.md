# PerformanceAI — Gestão Inteligente de Performance

Sistema completo de gestão de performance de equipes com IA, construído com React + TypeScript + Supabase. Pronto para deploy na **Vercel**.

---

## Funcionalidades

- **Autenticação segura** com Supabase Auth (login, cadastro, confirmação de e-mail)
- **Painel do Gestor** com visão geral da equipe, carga de trabalho e métricas
- **Painel do Colaborador** com tarefas, metas e gamificação
- **Gestão de Colaboradores** — criação de usuários com trigger automática no banco
- **Atribuição de Contratos e Veículos** por colaborador
- **Análises Avançadas** com gráficos e exportação CSV para BI (Excel, Power BI, Looker Studio)
- **Assistente IA** contextual com insights sobre carga e produtividade
- **Mapa de Competências** com radar de habilidades por colaborador
- **PWA** — instalável em desktop e mobile com suporte offline parcial
- **Fila Offline** — operações enfileiradas e sincronizadas ao reconectar

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Estilo | TailwindCSS + shadcn/ui |
| Animações | Framer Motion |
| Backend / Auth | Supabase (PostgreSQL + Auth + Storage) |
| Gráficos | Recharts |
| PWA | vite-plugin-pwa + Workbox |
| Deploy | Vercel |

---

## Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta na [Vercel](https://vercel.com) (gratuita)

---

## Configuração Local

### 1. Clone o repositório

```bash
git clone https://github.com/Jemerson07/performance-compass.git
cd performance-compass
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_anon_publica
```

> Encontre esses valores em: **Supabase Dashboard → Project Settings → API**

### 4. Execute as migrações do banco

No painel do Supabase, acesse **SQL Editor** e execute os arquivos da pasta `supabase/migrations/` em ordem cronológica:

1. `20260325132243_a74d4eba-33b0-4c0f-8395-ea59cb0b5fd2.sql`
2. `20260325154030_create_comprehensive_performance_system.sql`
3. `20260325200000_fix_handle_new_user_trigger.sql`

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:8080](http://localhost:8080)

---

## Deploy na Vercel

### Passo 1 — Importe o repositório

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em **"Import Git Repository"**
3. Selecione o repositório `Jemerson07/performance-compass`
4. Clique em **"Import"**

### Passo 2 — Configure as variáveis de ambiente

Na tela de configuração (ou em **Project Settings → Environment Variables**), adicione:

| Nome | Valor |
|---|---|
| `VITE_SUPABASE_URL` | `https://SEU_PROJETO.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sua_chave_anon_publica` |

### Passo 3 — Deploy

Clique em **"Deploy"**. O processo leva cerca de 1-2 minutos. As configurações de build já estão no `vercel.json`.

### Passo 4 — Configure o Supabase para o domínio da Vercel

1. No Supabase Dashboard, vá em **Authentication → URL Configuration**
2. Em **"Site URL"**, adicione a URL do seu projeto Vercel:
   ```
   https://seu-projeto.vercel.app
   ```
3. Em **"Redirect URLs"**, adicione:
   ```
   https://seu-projeto.vercel.app/**
   ```

### Passo 5 — Primeiro acesso

1. Acesse a URL do seu deploy
2. Clique em **"Cadastrar"**
3. Crie uma conta com o papel **"Gestor"**
4. Confirme o e-mail recebido
5. Faça login e comece a cadastrar colaboradores em **Colaboradores → Novo Colaborador**

---

## Banco de Dados (Supabase)

### Tabelas principais

| Tabela | Descrição |
|---|---|
| `profiles` | Perfis de usuários (nome, cargo, avatar) |
| `employees` | Dados de colaboradores (carga, contratos, veículos) |
| `user_roles` | Papéis de acesso (`manager` ou `employee`) |
| `contracts` | Contratos atribuídos a colaboradores |
| `vehicles` | Veículos atribuídos a colaboradores |
| `curriculum_files` | Currículos enviados em PDF |
| `ai_analysis` | Análises de IA sobre currículos |
| `offline_queue` | Fila de operações offline para sincronização |

### Trigger `handle_new_user`

O cadastro de usuários é gerenciado por uma trigger automática no banco. Ao criar um usuário via `supabase.auth.signUp()`, a trigger cria automaticamente os registros em `profiles`, `employees` e `user_roles` usando os metadados fornecidos. **Não é necessário fazer inserts manuais nessas tabelas.**

---

## Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
│   ├── chat/         # Painel do Assistente IA
│   ├── charts/       # Gráficos semanais
│   ├── dashboard/    # Widgets do painel
│   └── layout/       # Sidebar e layout
├── contexts/         # AppContext (estado global)
├── data/             # Dados mock para demonstração
├── hooks/            # useAuth, use-toast, etc.
├── integrations/     # Cliente e tipos do Supabase
├── lib/              # Utilitários (bi, offlineQueue, aiAssistant, authErrors)
├── pages/            # Páginas da aplicação
└── types/            # Tipos TypeScript globais

supabase/
└── migrations/       # Migrações SQL do banco de dados

vercel.json           # Configuração de roteamento SPA e headers de segurança
.env.example          # Modelo de variáveis de ambiente
```

---

## Scripts Disponíveis

```bash
npm run dev        # Servidor de desenvolvimento (porta 8080)
npm run build      # Build de produção
npm run preview    # Preview do build de produção
npm run lint       # Verificação de código
npm run test       # Executa os testes
```

---

## Segurança

- Autenticação gerenciada pelo Supabase Auth
- Row Level Security (RLS) em todas as tabelas
- Gestores visualizam dados de toda a equipe
- Colaboradores visualizam apenas seus próprios dados
- Headers de segurança configurados no `vercel.json` (X-Frame-Options, X-XSS-Protection, etc.)
- Variáveis de ambiente nunca expostas no repositório

---

## Licença

MIT © Jemerson
