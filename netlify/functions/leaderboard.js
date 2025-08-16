const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

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
