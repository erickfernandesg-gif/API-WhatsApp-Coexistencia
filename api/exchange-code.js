export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const { code } = req.body || {};
  if (typeof code !== 'string' || !code.trim()) return res.status(400).json({ error: 'Authorization code is required.' });
  const { META_APP_ID, META_APP_SECRET, GRAPH_API_VERSION = 'v21.0' } = process.env;
  if (!META_APP_ID || !META_APP_SECRET) return res.status(503).json({ error: 'Server authorization is not configured.' });
  const params = new URLSearchParams({ client_id: META_APP_ID, client_secret: META_APP_SECRET, code: code.trim() });
  try {
    const response = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/oauth/access_token?${params}`, { method: 'POST' });
    const payload = await response.json();
    if (!response.ok) { console.error('Meta authorization exchange failed:', payload?.error?.code); return res.status(502).json({ error: 'Meta could not complete the authorization exchange.' }); }
    return res.status(200).json({ authorized: Boolean(payload.access_token) });
  } catch (error) { console.error('Meta authorization exchange request failed:', error.message); return res.status(502).json({ error: 'Could not reach Meta authorization service.' }); }
}
