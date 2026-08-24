export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, credential } = req.body;
  const authorizedDevEmail = process.env.ADMIN_DEV_EMAIL || 'hminhgalaxy@gmail.com';

  if (!email || email !== authorizedDevEmail) {
    return res.status(403).json({ authorized: false, message: 'Unauthorized developer identity.' });
  }

  return res.status(200).json({
    authorized: true,
    role: 'DEV',
    sessionToken: `nox_dev_${Buffer.from(Date.now() + email).toString('base64')}`
  });
}
