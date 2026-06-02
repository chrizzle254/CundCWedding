const { createClient } = require('@supabase/supabase-js');
const path = require('path');

let weddingConfig = {};
try { weddingConfig = require(path.join(__dirname, '../../config.js')); } catch (_) {}

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
        // ── GET: return all overrides + custom items ──────────────────────
        if (event.httpMethod === 'GET') {
            const [{ data: overrideRows, error: e1 }, { data: customRows, error: e2 }] = await Promise.all([
                supabase.from('item_overrides').select('*'),
                supabase.from('custom_items').select('*').order('position', { ascending: true }),
            ]);
            if (e1) throw e1;
            if (e2) throw e2;

            // Convert overrides array → object keyed by id
            const overrides = {};
            (overrideRows || []).forEach(r => {
                overrides[r.id] = { checked: r.checked, label: r.label };
            });

            return {
                statusCode: 200,
                headers: HEADERS,
                body: JSON.stringify({ overrides, customs: customRows || [] }),
            };
        }

        // ── POST: mutations ───────────────────────────────────────────────
        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body || '{}');
            const { action } = body;

            // Toggle checked on a built-in item
            if (action === 'toggle') {
                const { id, checked } = body;
                const { error } = await supabase.from('item_overrides').upsert(
                    { id, checked, updated_at: new Date().toISOString() },
                    { onConflict: 'id' }
                );
                if (error) throw error;
                return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
            }

            // Edit label of a built-in item
            if (action === 'edit') {
                const { id, label } = body;
                const { error } = await supabase.from('item_overrides').upsert(
                    { id, label, updated_at: new Date().toISOString() },
                    { onConflict: 'id' }
                );
                if (error) throw error;
                return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
            }

            // Add a new custom item
            if (action === 'add') {
                const { list, list_key, data, position } = body;
                const { data: inserted, error } = await supabase
                    .from('custom_items')
                    .insert({ list, list_key: list_key || null, data, position: position || 0, checked: false })
                    .select()
                    .single();
                if (error) throw error;
                return { statusCode: 200, headers: HEADERS, body: JSON.stringify(inserted) };
            }

            // Toggle checked on a custom item
            if (action === 'toggle_custom') {
                const { id, checked } = body;
                const { error } = await supabase.from('custom_items').update({ checked }).eq('id', id);
                if (error) throw error;
                return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
            }

            // Edit a custom item's data
            if (action === 'edit_custom') {
                const { id, data } = body;
                const { error } = await supabase.from('custom_items').update({ data }).eq('id', id);
                if (error) throw error;
                return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
            }

            // Delete a custom item
            if (action === 'delete_custom') {
                const { id } = body;
                const { error } = await supabase.from('custom_items').delete().eq('id', id);
                if (error) throw error;
                return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
            }

            return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'Unknown action' }) };
        }

        return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };
    } catch (err) {
        console.error('items function error:', err);
        return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: err.message }) };
    }
};
