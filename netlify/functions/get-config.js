const jwt = require('jsonwebtoken');

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').map(c => c.trim()).filter(Boolean).reduce((acc, cur) => {
    const [k, ...v] = cur.split('=');
    acc[k] = decodeURIComponent(v.join('='));
    return acc;
  }, {});
}

exports.handler = async (event) => {
  const cookies = parseCookies(event.headers.cookie || '');
  const token = cookies['wedding_token'];
  if (!token) return { statusCode: 401, body: 'Unauthorized' };

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  let weddingConfig;
  try {
    weddingConfig = JSON.parse(process.env.WEDDING_CONFIG || '{}');
  } catch {
    return { statusCode: 500, body: 'Server config error' };
  }

  const publicConfig = { ...weddingConfig };
  delete publicConfig.password;

  return {
    statusCode: 200,
    body: JSON.stringify(publicConfig)
  };
};
