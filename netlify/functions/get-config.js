exports.handler = async (event) => {
  try {
    const authHeader = event.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return { statusCode: 401, body: JSON.stringify({ error: "Missing token" }) };
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [pw] = decoded.split(':');
    if (pw !== process.env.WEDDING_PASSWORD) {
      return { statusCode: 403, body: JSON.stringify({ error: "Invalid token" }) };
    }

    const config = JSON.parse(process.env.WEDDING_CONFIG);
    return { statusCode: 200, body: JSON.stringify(config) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
