# Guia de Teste - PerformanceAI

## Checklist de Funcionalidades Implementadas

### 1. Sistema de Autenticação

**Teste 1: Criar Conta de Gestor**
- [ ] Acesse a página inicial
- [ ] Clique em "Cadastrar"
- [ ] Preencha: email, senha, nome
- [ ] Selecione perfil "Gestor"
- [ ] Clique em "Criar conta"
- [ ] Verifique se foi criado com sucesso

**Teste 2: Login**
- [ ] Faça login com as credenciais criadas
- [ ] Verifique se aparece "Gestor" no perfil
- [ ] Confirme acesso ao menu completo

### 2. Gestão de Colaboradores

**Teste 3: Criar Colaborador**
- [ ] Acesse "Colaboradores" no menu lateral
- [ ] Clique em "Novo Colaborador"
- [ ] Preencha todos os campos:
  - Email: teste@empresa.com
  - Senha: teste123
  - Nome: João da Silva
  - Cargo: Analista
  - Avatar: Escolha um
- [ ] Clique em "Criar Colaborador"
- [ ] Verifique card do colaborador criado

**Teste 4: Upload de Currículo (Simulado)**
- [ ] No card do colaborador criado
- [ ] Clique em "Enviar CV"
- [ ] Selecione qualquer arquivo PDF
- [ ] Clique em "Enviar e Analisar com IA"
- [ ] Verifique mensagem de sucesso
- [ ] Confirme ícone verde de CV analisado

**Teste 5: Criar Múltiplos Colaboradores**
- [ ] Crie pelo menos 3 colaboradores diferentes
- [ ] Use cargos variados (Desenvolvedor, Coordenador, Atendimento)
- [ ] Escolha avatars diferentes para cada um

### 3. Atribuição de Contratos e Veículos

**Teste 6: Atribuir Contratos**
- [ ] Acesse "Atribuições" no menu
- [ ] Selecione um colaborador
- [ ] Clique no "+" em Contratos
- [ ] Preencha:
  - Número: CONT-001
  - Cliente: Empresa XYZ
  - Valor: 10000
- [ ] Clique em "Adicionar"
- [ ] Adicione mais 2 contratos ao mesmo colaborador
- [ ] Verifique contador de contratos aumentando

**Teste 7: Atribuir Veículos**
- [ ] Na mesma página de Atribuições
- [ ] Com colaborador selecionado
- [ ] Clique no "+" em Veículos
- [ ] Preencha:
  - Placa: ABC-1234
  - Marca: Toyota
  - Modelo: Corolla
  - Ano: 2020
- [ ] Clique em "Adicionar"
- [ ] Adicione mais veículos
- [ ] Verifique contador de veículos

**Teste 8: Criar Sobrecarga**
- [ ] Selecione um colaborador
- [ ] Adicione 8+ contratos
- [ ] Adicione 10+ veículos
- [ ] Verifique alerta de sobrecarga
- [ ] Confirme ícone de alerta no card

**Teste 9: Remover Contratos/Veículos**
- [ ] Clique no X de um contrato
- [ ] Confirme remoção
- [ ] Repita para veículo
- [ ] Verifique contador diminuindo

### 4. Dashboard do Gestor

**Teste 10: Visualizar Métricas**
- [ ] Acesse Dashboard (página inicial)
- [ ] Verifique cards de estatísticas
- [ ] Confirme número de colaboradores
- [ ] Veja métricas da equipe

**Teste 11: Alertas de Sobrecarga**
- [ ] Procure alerta vermelho se houver colaborador sobrecarregado
- [ ] Leia recomendações da IA
- [ ] Verifique nome do colaborador no alerta

**Teste 12: Tabela da Equipe**
- [ ] Visualize tabela com todos colaboradores
- [ ] Clique em um colaborador
- [ ] Veja radar de competências à direita
- [ ] Confirme carga, contratos e veículos

**Teste 13: Redistribuição de Tarefas**
- [ ] Encontre seção "Redistribuição de Tarefas"
- [ ] Clique em colaborador sobrecarregado
- [ ] Selecione uma tarefa
- [ ] Escolha colaborador disponível
- [ ] Confirme redistribuição
- [ ] Veja histórico

### 5. Dashboard do Colaborador

**Teste 14: Logar como Colaborador**
- [ ] Faça logout
- [ ] Entre com email de colaborador criado
- [ ] Senha que definiu na criação
- [ ] Verifique dashboard simplificado
- [ ] Confirme que não vê menu de gestor

**Teste 15: Ver Estatísticas Pessoais**
- [ ] Veja seus cards de performance
- [ ] Confirme tarefas, precisão, emails
- [ ] Verifique gamificação (nível, XP)

**Teste 16: Registrar Atividade**
- [ ] Use formulário "Registrar Atividade"
- [ ] Preencha descrição
- [ ] Escolha origem (Excel, Email, BI, Manual)
- [ ] Defina prioridade e status
- [ ] Preencha tempos
- [ ] Salve atividade
- [ ] Veja na lista de "Registradas hoje"

### 6. Competências

**Teste 17: Visualizar Radar**
- [ ] Acesse "Competências" no menu
- [ ] Veja radar de habilidades
- [ ] Observe 6 categorias
- [ ] Se gestor, selecione outros colaboradores

**Teste 18: Pontos Fortes e Desenvolvimento**
- [ ] Veja seção "Pontos Fortes"
- [ ] Confirme habilidades acima de 85
- [ ] Veja "Áreas para Desenvolvimento"
- [ ] Confirme habilidades abaixo de 75

### 7. Análises Avançadas (Gestor)

**Teste 19: Gráficos de Análise**
- [ ] Acesse "Análises" no menu
- [ ] Veja comparação de carga
- [ ] Observe origem das demandas (pizza)
- [ ] Veja previsão de demanda

**Teste 20: Insights Automáticos**
- [ ] Role até "Insights Automáticos"
- [ ] Leia todas as 6 recomendações
- [ ] Verifique ícones e mensagens

### 8. Assistente IA

**Teste 21: Abrir Chat**
- [ ] Clique em "Assistente IA" no menu
- [ ] Painel abre na direita
- [ ] Veja mensagem de boas-vindas
- [ ] Confirme sugestões rápidas

**Teste 22: Fazer Perguntas**
- [ ] Digite "Quem está sobrecarregado?"
- [ ] Aguarde resposta
- [ ] Teste "Como melhorar produtividade?"
- [ ] Veja resposta com dicas
- [ ] Teste "Análise da equipe"

**Teste 23: Sugestões Rápidas**
- [ ] Clique em uma sugestão rápida
- [ ] Veja preencher campo de input
- [ ] Envie a mensagem
- [ ] Confira resposta contextual

### 9. Funcionalidade Offline

**Teste 24: Verificar Indicador**
- [ ] Veja indicador no canto superior direito
- [ ] Deve mostrar "Online" em verde
- [ ] Confirme ícone de Wifi

**Teste 25: Simular Offline**
- [ ] Abra DevTools (F12)
- [ ] Vá em Network
- [ ] Marque "Offline"
- [ ] Veja indicador mudar para "Offline" amarelo
- [ ] Tente fazer uma operação
- [ ] Volte online
- [ ] Veja sincronização automática

**Teste 26: Prompt de Instalação**
- [ ] Aguarde aparecer prompt de instalação
- [ ] Leia "Instalar PerformanceAI"
- [ ] Ou feche para testar dismiss
- [ ] Se instalou, veja app nativo

### 10. PWA e Instalação

**Teste 27: Instalar no Desktop**
- [ ] No Chrome, clique no ícone de instalação (barra de endereço)
- [ ] Ou aguarde prompt automático
- [ ] Clique em "Instalar"
- [ ] Abra como aplicativo
- [ ] Confirme funcionamento igual

**Teste 28: Instalar no Mobile**
- [ ] Acesse pelo celular
- [ ] Chrome: Menu → "Adicionar à tela inicial"
- [ ] Safari: Compartilhar → "Adicionar à Tela de Início"
- [ ] Abra app da home screen
- [ ] Teste funcionalidades

**Teste 29: Usar Offline Completo**
- [ ] Com app instalado
- [ ] Ative modo avião
- [ ] Navegue pelo sistema
- [ ] Veja dados em cache
- [ ] Tente operações (vão para fila)
- [ ] Desative modo avião
- [ ] Veja sincronização

### 11. Segurança e Permissões

**Teste 30: Restrição de Acesso**
- [ ] Como colaborador, tente acessar menu gestor
- [ ] Confirme que opções não aparecem
- [ ] Logout e login como gestor
- [ ] Veja todas opções

**Teste 31: Dados Isolados**
- [ ] Como colaborador, veja apenas seus dados
- [ ] Não deve ver dados de outros
- [ ] Como gestor, veja todos os dados

### 12. Responsividade

**Teste 32: Mobile**
- [ ] Acesse pelo celular
- [ ] Teste todas as páginas
- [ ] Confirme sidebar colapsa
- [ ] Veja gráficos adaptados

**Teste 33: Tablet**
- [ ] Teste em tablet ou redimensione janela
- [ ] Confirme layout grid adaptativo
- [ ] Veja cards reorganizados

### 13. Performance

**Teste 34: Tempo de Carregamento**
- [ ] Recarregue página
- [ ] Deve carregar em < 3 segundos
- [ ] Verifique animações suaves

**Teste 35: Cache de Dados**
- [ ] Navegue entre páginas
- [ ] Volte para página já visitada
- [ ] Deve carregar instantaneamente

## Cenário Completo de Uso

### Fluxo do Gestor
1. Criar conta de gestor
2. Criar 5 colaboradores com cargos diferentes
3. Upload de currículos para 3 deles
4. Atribuir contratos: 3 para João, 8 para Maria (sobrecarga)
5. Atribuir veículos: 5 para João, 12 para Maria (sobrecarga)
6. Ver alertas de sobrecarga no dashboard
7. Usar redistribuição para mover 2 contratos de Maria para João
8. Acessar análises e ver insights
9. Usar chat IA para pedir "Sugestão de tarefas"
10. Instalar app no desktop

### Fluxo do Colaborador
1. Login como colaborador
2. Ver dashboard pessoal
3. Registrar 3 atividades diferentes
4. Ver competências no radar
5. Usar chat IA para pedir "Dicas de produtividade"
6. Testar modo offline
7. Instalar app no mobile

## Problemas Conhecidos para Verificar

- [ ] Se surgir erro 403 no storage, bucket foi criado
- [ ] Se análise de CV não funcionar, verificar permissões
- [ ] Se offline não sincroniza, verificar connection
- [ ] Se PWA não aparece, verificar HTTPS

## Dados de Teste Sugeridos

### Colaboradores
1. João Silva - Analista de Dados
2. Maria Santos - Desenvolvedora
3. Pedro Costa - Coordenador
4. Ana Oliveira - Analista Financeiro
5. Carlos Lima - Atendimento

### Contratos
- CONT-001 a CONT-020
- Clientes variados: Empresa A, B, C, etc.
- Valores: 5000 a 50000

### Veículos
- Placas: ABC-1234, DEF-5678, etc.
- Marcas: Toyota, Honda, Ford, Chevrolet
- Modelos: Corolla, Civic, Fusion, Cruze

## Resultado Esperado

Ao final dos testes, você deve ter:
- Sistema completo funcionando
- Gestores gerenciando colaboradores
- Contratos e veículos atribuídos
- IA respondendo perguntas
- App instalado e offline
- Dados sincronizados
