const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const body = event.body ? JSON.parse(event.body) : {};
  const { password } = body;

  let weddingConfig;
  try {
    weddingConfig = JSON.parse(process.env.WEDDING_CONFIG || '{}');
  } catch (err) {
    return { statusCode: 500, body: 'Server config error' };
  }

  if (!password || password !== weddingConfig.password) {
    return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
  }

  const token = jwt.sign({ sub: 'wedding-guest' }, process.env.JWT_SECRET, { expiresIn: '12h' });
  const maxAge = 12 * 60 * 60;
  const cookie = `wedding_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;

  const publicConfig = { ...weddingConfig };
  delete publicConfig.password;

  return {
    statusCode: 200,
    multiValueHeaders: { 'Set-Cookie': [cookie] },
    body: JSON.stringify(publicConfig)
  };
};
