const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Try to load config file if in development
let weddingConfig = {};
try {
    const configPath = path.join(__dirname, '../../config.js');
    weddingConfig = require(configPath);
    console.log('Loaded local config:', { 
        hasUrl: !!weddingConfig.supabaseUrl, 
        hasKey: !!weddingConfig.supabaseAnonKey 
    });
} catch (error) {
    console.log('No local config found, using environment variables');
}

// Get Supabase credentials with fallbacks
const supabaseUrl = process.env.SUPABASE_URL || weddingConfig.supabaseUrl;
const supabaseKey = process.env.SUPABASE_ANON_KEY || weddingConfig.supabaseAnonKey;

// Validate credentials
if (!supabaseUrl) {
    throw new Error('Supabase URL is required. Set SUPABASE_URL environment variable or provide it in config.js');
}
if (!supabaseKey) {
    throw new Error('Supabase Anon Key is required. Set SUPABASE_ANON_KEY environment variable or provide it in config.js');
}

console.log('Initializing Supabase client with URL:', supabaseUrl.substring(0, 20) + '...');

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async function(event, context) {
    // Add CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }

    console.log('Request received:', {
        method: event.httpMethod,
        body: event.body,
        headers: event.headers
    });

    try {
        if (event.httpMethod === 'GET') {
            const { data: topScores, error } = await supabase
                .from('reaction_scores')
                .select('*')
                .order('score', { ascending: true })
                .limit(5);

            if (error) throw error;

            console.log('GET success, returning scores:', topScores);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(topScores)
            };
        }

        if (event.httpMethod === 'POST') {
            console.log('Received POST request with body:', event.body);
            const { name, score } = JSON.parse(event.body);
            
            if (!name || !score || typeof score !== 'number') {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Invalid score data' })
                };
            }

            // Insert the new score
            const { error: insertError } = await supabase
                .from('reaction_scores')
                .insert([{
                    name: name.trim(),
                    score,
                    created_at: new Date().toISOString()
                }]);

            if (insertError) throw insertError;

            // Get updated top scores
            const { data: topScores, error: fetchError } = await supabase
                .from('reaction_scores')
                .select('*')
                .order('score', { ascending: true })
                .limit(5);

            if (fetchError) throw fetchError;

            console.log('POST success, returning updated scores:', topScores);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(topScores)
            };
        }
    } catch (error) {
        console.error('Error in function:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Internal server error', error: error.message })
        };
    }
};
