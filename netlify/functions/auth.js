// netlify/functions/auth.js
exports.handler = async function(event, context) {
  const { password } = JSON.parse(event.body || '{}');
  const correctPassword = process.env.WEDDING_PASSWORD;
  if (password === correctPassword) {
    // Return config without password
    let config = JSON.parse(process.env.WEDDING_CONFIG || '{}');
    if (config.password) delete config.password;
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, config }),
      headers: { 'Content-Type': 'application/json' },
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: 'Incorrect password.' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};
