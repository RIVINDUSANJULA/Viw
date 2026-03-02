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
  

  const { data: tenantCheck } = await supabase
    .from('projects')
    .select('id')
    .eq('tenant_id', tenantId)
    .maybeSingle();

  if (!tenantCheck) {
    console.log("Tenant missing. Auto-creating tenant record...");
    await supabase.from('tenants').insert([{ id: tenantId, name: 'Auto-Generated Workspace' }]);
  }

  const { data: existingProject } = await supabase
    .from('projects')
    .select('id')
    .eq('tenant_id', tenantId)
    .limit(1)
    .maybeSingle();

  let finalProjectId = existingProject?.id;

  if (!finalProjectId) {
    console.log("No project found. Auto-creating 'Main Board'...");
    const { data: newProject, error: insertProjectError } = await supabase
      .from('projects')
      .insert([{ name: 'Main Board', tenant_id: tenantId }])
      .select('id')
      .single();

    if (insertProjectError) throw new Error(`Database Error: ${insertProjectError.message}`);
    finalProjectId = newProject.id; 
  }

  const { data: columnCheck } = await supabase
    .from('board_columns')
    .select('id')
    .eq('id', columnId)
    .maybeSingle();

  if (!columnCheck) {
    console.log(`Column '${columnId}' missing. Auto-creating default board columns...`);
    const { error: colError } = await supabase
      .from('board_columns')
      .insert([
        { id: 'todo', tenant_id: tenantId, title: 'To Do', position_index: 0 },
        { id: 'in-progress', tenant_id: tenantId, title: 'In Progress', position_index: 1 },
        { id: 'done', tenant_id: tenantId, title: 'Done', position_index: 2 }
      ]);
      
    if (colError) console.error("Failed to seed default columns:", colError);
  }

  const { data: newTask, error: taskError } = await supabase
    .from('tasks')
    .insert([{
        tenant_id: tenantId,
        project_id: finalProjectId,
        column_id: columnId,
        title: content,
        position_index: 0
      }])
    .select()
    .single();

  if (taskError) throw taskError;
  return newTask as Task;
};






export const deleteTask = async (taskId: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
};





export const updateTaskDetails = async (taskId: string, title: string, description: string) => {
  const { error } = await supabase
    .from('tasks')
    .update({ 
      title: title, 
      description: description 
    })
    .eq('id', taskId);

  if (error) throw error;
};