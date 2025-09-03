// api/state.js
module.exports = async (req, res) => {
  // Vérifie la méthode
  if (req.method !== 'POST') {
    return res.status(405).send('Méthode non autorisée');
  }

  // Optionnel: simple protection par clé
  const key = req.headers['x-api-key'] || req.query.apikey;
  const EXPECTED = process.env.API_KEY || 'ABC123'; // mettre la même clé côté ESP32
  if (key && key !== EXPECTED) {
    return res.status(403).json({ error: 'Clé API invalide' });
  }

  // Lecture corps brut (serverless Node sur Vercel)
  let body = '';
  req.on('data', chunk => (body += chunk.toString()));
  req.on('end', () => {
    try {
      const data = body ? JSON.parse(body) : {};
      // Ex: { relay1: true, relay2: false, switch: true, reason: "heartbeat" }
      return res.status(200).json({ ok: true, received: data, ts: Date.now() });
    } catch (e) {
      return res.status(400).json({ ok: false, error: 'JSON invalide' });
    }
  });
};
