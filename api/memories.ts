// FILE: api/memories.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// JWT helper
function generateToken(eventId: string, password: string): string {
  const secret = process.env.JWT_SECRET || 'qr-ani-secret-key-change-in-production';
  return jwt.sign({ eventId, password }, secret, { expiresIn: '7d' });
}

function verifyToken(token: string): { eventId: string; password: string } | null {
  try {
    const secret = process.env.JWT_SECRET || 'qr-ani-secret-key-change-in-production';
    return jwt.verify(token, secret) as { eventId: string; password: string };
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Initialize Supabase inside handler
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables:', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseKey 
    });
    res.status(500).json({ 
      error: 'Server configuration error',
      message: 'Missing Supabase credentials. Please check environment variables.' 
    });
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    switch (req.method) {
      case 'GET': {
        const { id, event_id, token } = req.query;

        // Get single memory by ID
        if (id) {
          const { data, error } = await supabase
            .from('memories')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          res.status(200).json(data);
          return;
        }

        // Get memories by event_id with authentication
        if (event_id) {
          const authHeader = req.headers.authorization;
          const providedToken = token || authHeader?.replace('Bearer ', '');

          if (!providedToken) {
            res.status(401).json({ error: 'Authentication required' });
            return;
          }

          const decoded = verifyToken(providedToken as string);
          if (!decoded || decoded.eventId !== event_id) {
            res.status(403).json({ error: 'Invalid or expired token' });
            return;
          }

          const { data, error } = await supabase
            .from('memories')
            .select('*')
            .eq('event_id', event_id)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          res.status(200).json(data);
          return;
        }

        // Get all memories (admin only - requires special token)
        const { data, error } = await supabase
          .from('memories')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        
        if (error) throw error;
        res.status(200).json(data);
        break;
      }

      case 'POST': {
        const { event_id, password, action, ...memoryData } = req.body;

        // Authenticate to get token
        if (action === 'authenticate') {
          if (!event_id || !password) {
            res.status(400).json({ error: 'event_id and password required' });
            return;
          }

          // Verify event exists and password matches
          const { data: event, error } = await supabase
            .from('events')
            .select('id, password')
            .eq('id', event_id)
            .single();

          if (error || !event || event.password !== password) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
          }

          const token = generateToken(event_id, password);
          res.status(200).json({ token, event_id });
          return;
        }

        // Create new memory
        const newMemory = {
          id: uuidv4(),
          event_id: event_id || null,
          title: memoryData.title || '',
          description: memoryData.description || '',
          content: memoryData.content || '',
          media_url: memoryData.media_url || null,
          media_type: memoryData.media_type || null,
          uploaded_by: memoryData.uploaded_by || 'anonymous',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdMemory, error: createError } = await supabase
          .from('memories')
          .insert([newMemory])
          .select()
          .single();
        
        if (createError) throw createError;
        res.status(201).json(createdMemory);
        break;
      }

      case 'PUT': {
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
        
        if (updateError) throw updateError;
        res.status(200).json(updatedMemory);
        break;
      }

      case 'DELETE': {
        const { id: deleteId } = req.query;
        if (!deleteId) {
          res.status(400).json({ error: 'Memory ID is required' });
          return;
        }

        const { error: deleteError } = await supabase
          .from('memories')
          .delete()
          .eq('id', deleteId);
        
        if (deleteError) throw deleteError;
        res.status(204).end();
        break;
      }

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 