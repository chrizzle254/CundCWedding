const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }

    try {
        if (event.httpMethod === 'GET') {
            const { data: topScores, error } = await supabase
                .from('reaction_scores')
                .select('*')
                .order('score', { ascending: true })
                .limit(5);

            if (error) throw error;

            return {
                statusCode: 200,
                body: JSON.stringify(topScores)
            };
        }

        if (event.httpMethod === 'POST') {
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

            return {
                statusCode: 200,
                body: JSON.stringify(topScores)
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', error: error.message })
        };
    }
};
