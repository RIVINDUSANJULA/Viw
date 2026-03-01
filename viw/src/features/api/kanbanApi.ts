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


export const createTask = async (tenantId: string, columnId: string | number, content: string) => {
  

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('tenant_id', tenantId)
    .maybeSingle();

  let projectId = project?.id;

  if (!projectId) {
    const { data: newProj } = await supabase
      .from('projects')
      .insert([{ name: 'Main Board', tenant_id: tenantId }])
      .select()
      .single();
    projectId = newProj.id;
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      tenant_id: tenantId,
      project_id: projectId,
      column_id: columnId,
      title: content,
      position_index: 0
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Task;
};