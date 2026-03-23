import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { tenantId } = req.params;
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('tenant_id', tenantId);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const taskData = req.body;
    
    // Server-side validation
    if (!taskData.title || !taskData.tenant_id) {
      return res.status(400).json({ error: 'Title and Tenant ID are required' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Storage Garbage Collection (Moved from Frontend!)
    const { data: files } = await supabase.storage.from('attachments').list('', { search: id });
    if (files && files.length > 0) {
      const fileNames = files.filter(f => f.name !== '.emptyFolderPlaceholder').map(f => f.name);
      if (fileNames.length > 0) {
        await supabase.storage.from('attachments').remove(fileNames);
      }
    }

    // 2. Delete the DB Row
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Task and attachments deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};