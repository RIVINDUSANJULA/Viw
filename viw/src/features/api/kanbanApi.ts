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
  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select('id')
    .eq('tenant_id', tenantId)
    .limit(1)
    .maybeSingle();

  if (projectError) throw new Error("Could not find an active project for this workspace.");

  //NEW TASK
  const { data: newTask, error: taskError } = await supabase
    .from('tasks')
    .insert([{
      tenant_id: tenantId,
      project_id: projectData.id,
      column_id: columnId,
      content: content,
      
      // DEMO CHANGE PLEASE - RIVINDU
      title: "New Task", 
      
      
      position_index: 0
    }])
    .select()
    .maybeSingle();

  if (taskError) throw taskError;
  return newTask as Task;
};