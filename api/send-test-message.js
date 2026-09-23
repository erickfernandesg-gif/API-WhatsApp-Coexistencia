export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TEST_RECIPIENT, GRAPH_API_VERSION = 'v21.0' } = process.env;
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_TEST_RECIPIENT) {
    return res.status(503).json({ error: 'Test messaging is not configured on the server.' });
  }

  try {
    const response = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: WHATSAPP_TEST_RECIPIENT,
        type: 'text',
        text: { body: 'Mensagem de teste enviada pela integração oficial WhatsApp Business Cloud API.' }
      })
    });
    const payload = await response.json();
    if (!response.ok) {
      console.error('WhatsApp test message failed:', payload?.error?.code);
      return res.status(502).json({ error: 'Meta could not send the test message.' });
    }
    return res.status(200).json({ sent: Boolean(payload.messages?.[0]?.id) });
  } catch (error) {
    console.error('WhatsApp test message request failed:', error.message);
    return res.status(502).json({ error: 'Could not reach WhatsApp Cloud API.' });
  }
}
