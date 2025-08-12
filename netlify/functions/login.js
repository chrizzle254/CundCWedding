exports.handler = async (event) => {
  try {
    const { password } = JSON.parse(event.body || '{}');
    const correctPassword = process.env.WEDDING_PASSWORD;

    if (password !== correctPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid password" })
      };
    }

    // Very simple token (Base64)
    const token = Buffer.from(`${password}:${Date.now()}`).toString('base64');

    return {
      statusCode: 200,
      body: JSON.stringify({ token })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
