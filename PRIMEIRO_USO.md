# PerformanceAI - Guia de Primeiro Uso

## Início Rápido

### Passo 1: Acessar o Sistema

1. Abra seu navegador (Chrome, Edge, ou Brave recomendados)
2. Acesse a URL do sistema
3. Você verá a tela de login

### Passo 2: Criar Conta de Gestor

1. Clique em **"Cadastrar"**
2. Preencha os dados:
   - **E-mail:** seu-email@empresa.com
   - **Senha:** mínimo 6 caracteres (ex: gestor123)
   - **Nome Completo:** Seu Nome
   - **Perfil:** Selecione **"Gestor"**
3. Clique em **"Criar conta"**
4. Você será direcionado ao sistema

### Passo 3: Criar Seus Primeiros Colaboradores

1. No menu lateral, clique em **"Colaboradores"**
2. Clique no botão **"+ Novo Colaborador"**
3. Preencha os dados do primeiro colaborador:
   - **E-mail:** joao@empresa.com
   - **Senha:** senha123 (será a senha inicial dele)
   - **Nome Completo:** João da Silva
   - **Cargo:** Analista de Dados
   - **Avatar:** Escolha um dos 8 disponíveis
4. Clique em **"Criar Colaborador"**
5. Repita para criar mais colaboradores

**Sugestão:** Crie pelo menos 3 colaboradores para testar completamente o sistema.

### Passo 4: Enviar Currículos (Opcional)

1. Na página de Colaboradores
2. No card de um colaborador, clique em **"Enviar CV"**
3. Selecione um arquivo PDF (pode ser qualquer PDF para teste)
4. Clique em **"Enviar e Analisar com IA"**
5. O sistema irá processar e extrair competências automaticamente
6. Um ícone verde aparecerá indicando currículo analisado

### Passo 5: Atribuir Contratos e Veículos

1. No menu lateral, clique em **"Atribuições"**
2. Na lista à esquerda, clique em um colaborador
3. Para adicionar um contrato:
   - Clique no **+** na seção "Contratos"
   - Preencha:
     - Número do Contrato: CONT-001
     - Nome do Cliente: Empresa XYZ
     - Valor: 15000 (opcional)
   - Clique em **"Adicionar"**
4. Para adicionar um veículo:
   - Clique no **+** na seção "Veículos"
   - Preencha:
     - Placa: ABC-1234
     - Marca: Toyota
     - Modelo: Corolla
     - Ano: 2020
   - Clique em **"Adicionar"**
5. Adicione vários contratos e veículos para simular carga real

**Dica:** Para testar sobrecarga, adicione 8+ contratos e 10+ veículos em um colaborador.

### Passo 6: Explorar o Dashboard

1. Clique em **"Dashboard"** no menu
2. Observe as métricas da equipe
3. Veja alertas de sobrecarga (se houver)
4. Clique em colaboradores na tabela
5. Observe o radar de competências à direita

### Passo 7: Usar o Assistente IA

1. Clique em **"Assistente IA"** no menu lateral (ícone colorido)
2. Um painel abrirá à direita
3. Experimente perguntas:
   - "Quem está sobrecarregado?"
   - "Como melhorar produtividade?"
   - "Análise da equipe"
4. Clique nas sugestões rápidas abaixo do chat
5. Veja respostas contextuais da IA

### Passo 8: Testar como Colaborador

1. Clique no botão **"Sair"** no canto inferior do menu
2. Faça login com um dos colaboradores criados:
   - Email: joao@empresa.com
   - Senha: senha123 (a que você definiu)
3. Você verá o dashboard do colaborador (simplificado)
4. Explore:
   - Ver suas estatísticas
   - Registrar atividades
   - Ver suas competências
   - Usar o chat da IA

### Passo 9: Instalar como Aplicativo

**No Desktop:**
1. Procure o ícone de instalação na barra de endereço do navegador
2. OU aguarde aparecer o prompt no canto inferior
3. Clique em **"Instalar Aplicativo"**
4. O app será instalado como programa nativo
5. Abra pelo menu iniciar / dock

**No Mobile:**
1. Abra o sistema no navegador do celular
2. **Chrome Android:** Menu (3 pontos) → "Adicionar à tela inicial"
3. **Safari iOS:** Botão Compartilhar → "Adicionar à Tela de Início"
4. O ícone aparecerá na home screen
5. Abra como app nativo

### Passo 10: Testar Modo Offline

1. Com o sistema aberto (preferencialmente app instalado)
2. Vá para "Configurações de Rede" ou ative "Modo Avião"
3. Observe o indicador mudar para "Offline" (amarelo)
4. Navegue pelo sistema - dados em cache estarão disponíveis
5. Tente fazer uma operação (irá para fila)
6. Volte online
7. Veja a sincronização automática

## Cenário de Demonstração Completo

### Empresa Exemplo: TechSolutions Ltda

**Gestor:** Maria Costa (você)

**Equipe:**
1. João Silva - Analista de Dados
   - 3 contratos
   - 5 veículos
   - Currículo: forte em análise e técnico

2. Ana Santos - Desenvolvedora
   - 5 contratos
   - 8 veículos
   - Currículo: forte em execução e técnico

3. Pedro Lima - Atendimento
   - 12 contratos (SOBRECARREGADO)
   - 15 veículos (SOBRECARREGADO)
   - Precisa de apoio

4. Carlos Oliveira - Coordenador
   - 2 contratos (DISPONÍVEL)
   - 3 veículos (DISPONÍVEL)
   - Pode receber mais demandas

### Fluxo de Gestão:

1. **Identificar Problema:**
   - Dashboard mostra alerta: Pedro Lima sobrecarregado
   - Recomendação da IA: redistribuir tarefas

2. **Analisar Competências:**
   - Verificar radar de Pedro
   - Comparar com Carlos (disponível)
   - Carlos tem competências compatíveis

3. **Redistribuir Carga:**
   - Ir em "Atribuições"
   - Selecionar Pedro Lima
   - Remover 4 contratos
   - Selecionar Carlos Oliveira
   - Adicionar os 4 contratos removidos

4. **Verificar Resultado:**
   - Pedro agora está em 95% de carga
   - Carlos em 45% de carga
   - Equipe balanceada

5. **Consultar IA:**
   - "Análise da equipe"
   - IA confirma melhora na distribuição
   - Sugere próximos passos

## Dados de Exemplo para Teste

### Contratos Fictícios:
```
CONT-001 | Cliente: Empresa Alpha   | Valor: R$ 10.000
CONT-002 | Cliente: Empresa Beta    | Valor: R$ 15.000
CONT-003 | Cliente: Empresa Gamma   | Valor: R$ 8.500
CONT-004 | Cliente: Empresa Delta   | Valor: R$ 20.000
CONT-005 | Cliente: Empresa Epsilon | Valor: R$ 12.000
... (continue numerando)
```

### Veículos Fictícios:
```
ABC-1234 | Toyota Corolla 2020
DEF-5678 | Honda Civic 2019
GHI-9012 | Ford Fusion 2021
JKL-3456 | Chevrolet Cruze 2018
MNO-7890 | Volkswagen Jetta 2020
... (continue variando placas)
```

### Cargos Sugeridos:
- Analista de Dados
- Desenvolvedor
- Coordenador
- Atendimento
- Analista Financeiro
- Gerente de Projetos
- Suporte Técnico
- Analista de BI

## Dicas de Uso

1. **Sempre use o Assistente IA** - Ele dá insights valiosos
2. **Mantenha currículos atualizados** - Análise de competências melhora
3. **Monitore alertas de sobrecarga** - Previne burnout
4. **Use a fila offline** - Trabalhe sem internet e sincronize depois
5. **Instale como app** - Experiência mais rápida e nativa
6. **Explore todas as páginas** - Cada uma tem funcionalidades únicas
7. **Teste com dados reais** - Quanto mais dados, melhores os insights

## Solução de Problemas

**Não consigo fazer login:**
- Verifique se usou o email correto
- Senha mínima: 6 caracteres
- Limpe o cache do navegador

**Currículo não foi analisado:**
- Certifique-se que é PDF
- Máximo 10MB
- Aguarde alguns segundos

**Offline não sincroniza:**
- Verifique conexão com internet
- Recarregue a página
- Veja o contador de operações pendentes

**App não aparece para instalação:**
- Use Chrome, Edge ou Brave
- Certifique-se que está em HTTPS
- Aguarde alguns segundos após carregar

## Suporte

Use o **Assistente IA** para tirar dúvidas sobre:
- Como usar funcionalidades
- Interpretação de dados
- Recomendações de gestão
- Melhores práticas

Consulte os documentos:
- `MANUAL_DO_SISTEMA.md` - Manual completo
- `GUIA_DE_TESTE.md` - Testes detalhados
- `RESUMO_COMPLETO.md` - Todas as funcionalidades

---

**Pronto! Você está pronto para usar o PerformanceAI**

Comece criando sua conta de gestor e explore todas as funcionalidades.
