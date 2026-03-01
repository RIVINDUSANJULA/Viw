import { supabase } from '../../lib/supabase';
import { type Task, type Column } from '../../types/types';

export const fetchColumns = async (tenantId: string) => {
  const { data, error } = await supabase
    .from('board_columns')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('position_index', { ascending: true });

  if (error) throw error;
  return data as Column[];
};

export const fetchTasks = async (tenantId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('tenant_id', tenantId);

  if (error) throw error;
  return data as Task[];
};

export const updateTaskColumn = async (taskId: string | number, newColumnId: string | number) => {
  const { error } = await supabase
    .from('tasks')
    .update({ column_id: newColumnId })
    .eq('id', taskId);

  if (error) throw error;
};