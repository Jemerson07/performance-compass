# Análise de Problemas e Plano de Melhorias - PerformanceAI

Após analisar o código-fonte do repositório `performance-compass`, identifiquei os seguintes problemas e áreas de melhoria que precisam ser abordados para tornar o sistema robusto e pronto para produção na Vercel.

## 1. Problemas de Autenticação e Criação de Login

**Problema:** O fluxo de criação de usuário (SignUp) tem uma duplicação de responsabilidade que causa falhas.
- **Causa:** A migração do Supabase (`20260325132243_a74d4eba-33b0-4c0f-8395-ea59cb0b5fd2.sql`) já possui uma trigger `handle_new_user()` que insere automaticamente registros nas tabelas `profiles`, `employees` e `user_roles` quando um novo usuário é criado na tabela `auth.users`. No entanto, na página `EmployeeManagementPage.tsx`, o código do frontend tenta fazer inserts manuais nessas mesmas tabelas logo após chamar `supabase.auth.signUp()`. Isso gera erros de duplicação e violação de chave única.
- **Solução:** Remover os inserts manuais do frontend em `EmployeeManagementPage.tsx` e confiar exclusivamente na trigger do banco de dados. O frontend deve apenas chamar `signUp` passando os metadados necessários (nome, cargo, avatar, role) em `options.data`.

**Problema:** O cadastro na página de login (`AuthPage.tsx`) também pode estar sofrendo do mesmo problema, ou falhando em fornecer os metadados corretos para a trigger.
- **Solução:** Garantir que o `signUp` no `useAuth.tsx` envie todos os dados necessários no `options.data` para que a trigger `handle_new_user()` funcione perfeitamente.

## 2. Problemas de Robustez e Offline

**Problema:** O módulo `offlineQueue.ts` acessa APIs exclusivas do navegador (`navigator`, `window`, `localStorage`) diretamente no escopo global do módulo.
- **Causa:** Em ambientes de SSR (Server-Side Rendering) ou durante o build, essas APIs não existem. Embora o projeto seja Vite (SPA), o acesso global pode causar problemas em testes ou se houver alguma tentativa de pré-renderização.
- **Solução:** Mover o acesso a essas APIs para dentro de métodos que só são chamados quando o componente é montado (ex: dentro de um `useEffect` em um Provider ou inicialização explícita).

**Problema:** A sincronização offline mascara erros.
- **Causa:** O método `syncQueue` marca todas as operações pendentes como sincronizadas independentemente do sucesso individual das operações no banco.
- **Solução:** Atualizar o status de cada operação individualmente após seu sucesso.

## 3. Dados Mockados vs. Dados Reais

**Problema:** Várias páginas (`TeamPage`, `MindMapPage`, `EmployeeDashboard`, `ManagerDashboard`) dependem quase inteiramente de dados estáticos (`mockData.ts`).
- **Causa:** O sistema foi desenvolvido inicialmente como um protótipo visual.
- **Solução:** Integrar essas páginas com o Supabase, substituindo os mocks por chamadas reais usando React Query ou `useEffect` com o cliente do Supabase. Como o objetivo imediato é deixar o sistema funcional e corrigir bugs, faremos as integrações mais críticas (como a lista de funcionários e tarefas).

## 4. Deploy na Vercel

**Problema:** Falta de configuração específica e documentação clara para deploy.
- **Solução:** 
  1. Adicionar o arquivo `vercel.json` para garantir que o roteamento do React Router (SPA) funcione corretamente (`"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`).
  2. Atualizar o `README.md` com instruções claras sobre quais variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) devem ser configuradas na Vercel.

## Plano de Ação

1. **Corrigir Autenticação:**
   - Ajustar `useAuth.tsx` para passar os metadados corretos no `signUp`.
   - Limpar `EmployeeManagementPage.tsx` removendo os inserts manuais redundantes.
   - Ajustar a trigger SQL se necessário para aceitar os metadados adicionais (avatar, job_title).

2. **Melhorar Robustez:**
   - Refatorar `offlineQueue.ts` para ser seguro em ambientes sem `window`.
   - Tratar erros de sincronização corretamente.

3. **Preparar para Vercel:**
   - Criar `vercel.json`.
   - Limpar warnings de linting que possam quebrar o build.
   - Atualizar a documentação.
