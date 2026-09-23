# WhatsApp Business Coexistência

Este projeto contém o fluxo de Embedded Signup para coexistência e dois endpoints Vercel:

- `POST /api/exchange-code`: troca o código do Embedded Signup no servidor; nunca devolve o token ao navegador.
- `GET|POST /api/webhook`: valida o webhook da Meta e aceita apenas eventos com assinatura `X-Hub-Signature-256` válida.
- `POST /api/send-test-message`: envia uma única mensagem de demonstração, exclusivamente ao número de teste definido no servidor.

## Configuração obrigatória antes de publicar

No projeto da Vercel, em **Settings → Environment Variables**, crie os valores abaixo para Production, Preview e Development:

| Variável | Valor |
| --- | --- |
| `META_APP_ID` | ID do app Meta |
| `META_APP_SECRET` | App Secret, disponível em Meta for Developers → App settings → Basic |
| `META_WEBHOOK_VERIFY_TOKEN` | texto longo, aleatório e secreto, criado por você |
| `GRAPH_API_VERSION` | versão Graph API atualmente suportada pelo seu app Meta |
| `WHATSAPP_ACCESS_TOKEN` | token de usuário de sistema com as permissões WhatsApp necessárias |
| `WHATSAPP_PHONE_NUMBER_ID` | ID do número WhatsApp Cloud API de teste |
| `WHATSAPP_TEST_RECIPIENT` | número de teste autorizado, com código do país e sem `+` |

Depois do deploy, no painel Meta configure a URL de callback como `https://api-whats-app-coexistencia.vercel.app/api/webhook`.

Use exatamente o valor de `META_WEBHOOK_VERIFY_TOKEN` no campo **Verify token**. Assine os campos necessários da conta WhatsApp, incluindo `messages`; para coexistência, assine também os eventos adicionais indicados no fluxo de onboarding.

## Verificação local

```powershell
npm run check
```

Não inclua tokens, códigos de autorização, telefones de clientes ou o App Secret em gravações para App Review.
