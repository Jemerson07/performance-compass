# Instalação Offline, Servidor Local e APK

## 1) Banco de dados offline local

O sistema agora mantém um **banco local no navegador** (LocalStorage) para:

- cache de usuários para login offline
- sessão local do último usuário autenticado
- snapshots de analytics para auditoria e BI

Isso permite operar sem internet e sincronizar quando a conexão voltar.

## 2) Computador como servidor local (offline)

Para usar o próprio computador como servidor, rode:

```bash
npm install
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

Depois, acesse pela rede local no navegador de outro dispositivo.

## 3) Instalação rápida de APK (Android)

Opção recomendada:
1. Instalar via **PWA** direto no Chrome/Edge (botão "Instalar Aplicativo").
2. Para fluxo APK com ADB, usar um APK gerado da build web e instalar:

```bash
adb install performance-ai.apk
```

## 4) Planilhas e BI

Na tela **Análises Avançadas**:

- Use o botão **Exportar CSV (Planilhas/BI)** para enviar dados para Excel/Google Sheets/Power BI.
- Use **Salvar Snapshot Offline** para manter histórico local mesmo sem internet.
