import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);
// Enable CORS
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
export default async function handler(req, res) {
    setCorsHeaders(res);
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    try {
        switch (req.method) {
            case 'GET':
                // Get memory by ID or all memories
                const { id } = req.query;
                if (id) {
                    const { data, error } = await supabase
                        .from('memories')
                        .select('*')
                        .eq('id', id)
                        .single();
                    if (error)
                        throw error;
                    res.status(200).json(data);
                }
                else {
                    const { data, error } = await supabase
                        .from('memories')
                        .select('*')
                        .order('created_at', { ascending: false });
                    if (error)
                        throw error;
                    res.status(200).json(data);
                }
                break;
            case 'POST':
                // Create new memory
                const newMemory = {
                    id: uuidv4(),
                    ...req.body,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                const { data: createdMemory, error: createError } = await supabase
                    .from('memories')
                    .insert([newMemory])
                    .select()
                    .single();
                if (createError)
                    throw createError;
                res.status(201).json(createdMemory);
                break;
            case 'PUT':
                // Update memory
                const { id: updateId } = req.query;
                if (!updateId) {
                    res.status(400).json({ error: 'Memory ID is required' });
                    return;
                }
                const updateData = {
                    ...req.body,
                    updated_at: new Date().toISOString()
                };
                const { data: updatedMemory, error: updateError } = await supabase
                    .from('memories')
                    .update(updateData)
                    .eq('id', updateId)
                    .select()
                    .single();
                if (updateError)
                    throw updateError;
                res.status(200).json(updatedMemory);
                break;
            case 'DELETE':
                // Delete memory
                const { id: deleteId } = req.query;
                if (!deleteId) {
                    res.status(400).json({ error: 'Memory ID is required' });
                    return;
                }
                const { error: deleteError } = await supabase
                    .from('memories')
                    .delete()
                    .eq('id', deleteId);
                if (deleteError)
                    throw deleteError;
                res.status(204).end();
                break;
            default:
                res.status(405).json({ error: 'Method not allowed' });
        }
    }
    catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
