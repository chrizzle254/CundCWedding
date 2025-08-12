// netlify/functions/config.js
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      // Example: Replace with your actual config keys
      // apiKey: process.env.API_KEY,
      // anotherSecret: process.env.ANOTHER_SECRET
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
