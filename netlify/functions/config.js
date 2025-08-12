// netlify/functions/config.js
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: process.env.WEDDING_CONFIG,
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
