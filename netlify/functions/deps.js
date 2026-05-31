const { createClient } = require('@supabase/supabase-js');
const path = require('path');

let weddingConfig = {};
try {
    weddingConfig = require(path.join(__dirname, '../../config.js'));
} catch (_) {}

const supabaseUrl = process.env.SUPABASE_URL || weddingConfig.supabaseUrl;
const supabaseKey = process.env.SUPABASE_ANON_KEY || weddingConfig.supabaseAnonKey;
const supabase = createClient(supabaseUrl, supabaseKey);

const HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
};

exports.handler = async function(event) {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: HEADERS, body: '' };

    try {
        // GET — return all checked dep indices
        if (event.httpMethod === 'GET') {
            const { data, error } = await supabase
                .from('dep_checks')
                .select('dep_idx')
                .eq('checked', true);
            if (error) throw error;
            return {
                statusCode: 200,
                headers: HEADERS,
                body: JSON.stringify(data.map(r => r.dep_idx)),
            };
        }

        // POST — toggle a dep: { idx, checked }
        if (event.httpMethod === 'POST') {
            const { idx, checked } = JSON.parse(event.body || '{}');
            if (typeof idx !== 'number') {
                return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'idx required' }) };
            }

            const { error } = await supabase
                .from('dep_checks')
                .upsert({ dep_idx: idx, checked, updated_at: new Date().toISOString() }, { onConflict: 'dep_idx' });
            if (error) throw error;

            return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
        }

        return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };
    } catch (err) {
        console.error('deps function error:', err);
        return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: err.message }) };
    }
};
