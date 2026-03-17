import { supabase } from '../../lib/supabase';
import { type Task, type Column } from '../../types/types';

export const fetchColumns = async (tenantId: string) => {
  const { data, error } = await supabase
    .from('board_columns')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('position_index', { ascending: true });

  if (error) throw error;


  if (!data) {
    console.log(`No columns found for workspace ${tenantId}. Auto-creating defaults...`);
    
    const defaultColumns = [
      { id: `todo-${tenantId}`, tenant_id: tenantId, title: 'To Do', position_index: 0},
      { id: `in-progress-${tenantId}`, tenant_id: tenantId, title: 'In Progress', position_index: 1},
      { id: `done-${tenantId}`, tenant_id: tenantId, title: 'Done', position_index: 2}
    ];

    const { error: seedError } = await supabase
      .from('board_columns')
      .upsert(defaultColumns, { onConflict: 'id', ignoreDuplicates: true });

    if (seedError) {
      console.error("Failed to seed default columns:", seedError);
      return []; 
    }

    console.log(data)

    
    return defaultColumns as Column[];
  }

  return data as Column[];
};

export const fetchTasks = async (tenantId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('* , tenants ( name )')
    // .eq('tenant_id', tenantId)
    ;

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


export const createTask = async (tenantId: string, content: string) => {

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

  const { data: columns , error } = await supabase
    .from('board_columns')
    .select('id')
    .eq('id', tenantId)
    // .order('position_index', { ascending: true })
    // .maybeSingle()
    // .limit(1)
    ;

  if (error) throw error;

  //const targetColumnId = columns && columns.length > 0 ? columns[0].id : `todo-${tenantId}`;

  let targetColumnId;

  if (columns && columns.length > 0) {
    targetColumnId = columns[0].id;
  } else {
    // console.log("No columns exist. Auto-creating before saving task...");
    //ABOVE IS AYONNYING
    targetColumnId = `todo-${tenantId}`;
    const defaultColumns = [
      { id: targetColumnId, tenant_id: tenantId, title: 'To Do', position_index: 0 },
      { id: `in-progress-${tenantId}`, tenant_id: tenantId, title: 'In Progress', position_index: 1 },
      { id: `done-${tenantId}`, tenant_id: tenantId, title: 'Done', position_index: 2 }
    ];

    const { error } = await supabase.from('board_columns').upsert(defaultColumns, { onConflict: 'id', ignoreDuplicates: true });
    
    if (error) {
      console.log(error)
    }
  }

  const { data: newTask, error: taskError } = await supabase
    .from('tasks')
    .insert([{
        tenant_id: tenantId,
        project_id: finalProjectId,
        column_id: targetColumnId,
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



export const inviteUserToWorkspace = async (tenantId: string, email: string) => {
  
  const { data: userId, error: lookupError } = await supabase.rpc('get_user_id_by_email', { 
    email_to_check: email 
  });

  if (lookupError) throw new Error("Database error looking up user.");
  if (!userId) throw new Error("No registered user found with that email.");

  const { data: existingLink } = await supabase
    .from('tenant_users')
    .select('user_id')
    .eq('tenant_id', tenantId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existingLink) throw new Error("User is already in this workspace.");

  const { error: linkError } = await supabase
    .from('tenant_users')
    .insert([{
      tenant_id: tenantId,
      user_id: userId,
      role: 'member'
    }]);

  if (linkError) throw new Error("Failed to add user to workspace.");
  
  return true;
};



export const fetchWorkspaceMembers = async (tenantId : string) => {
  const { data, error } = await supabase.rpc('get_workspace_members', {
    workspace_id: tenantId
  });

  if (error) throw new Error("Failed to fetch workspace members.");
  return data;
};

export const assignTaskToUser = async (taskId: string, userId: string | null) => {
  const { error } = await supabase
    .from('tasks')
    .update({ assignee_id: userId })
    .eq('id', taskId);

  if (error) throw error;
};



export const uploadTaskAttachment = async (taskId: string, file: File) => {
  // const fileExt = file.name.split('.').pop();
  // const fileName = `${taskId}-${Math.random()}.${fileExt}`;

  const cleanOriginalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const fileName = `${taskId}___${cleanOriginalName}`;

  const { error: uploadError } = await supabase.storage
    .from('attachments')
    .upload(fileName, file, {
      upsert: true
    });

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);


  const { data: { publicUrl } } = supabase.storage
    .from('attachments')
    .getPublicUrl(fileName);




  const { error: updateError } = await supabase
    .from('tasks')
    .update({ attachment_url: publicUrl })
    .eq('id', taskId);

  if (updateError) throw new Error(`Failed to save URL to task: ${updateError.message}`);

  return publicUrl;
};


export const fetchStorageFiles = async (taskId: string) => {
  const { data, error } = await supabase.storage
    .from('attachments')
    .list('', {
      search: taskId // <-- This tells Supabase to only return files starting with this ID
    });

  if (error) throw new Error(`Failed to fetch files: ${error.message}`);
  

  
  return data.filter(file => file.name !== '.emptyFolderPlaceholder');
};

export const getFilePublicUrl = (fileName: string) => {
  const { data } = supabase.storage
    .from('attachments')
    .getPublicUrl(fileName);
    
  return data.publicUrl;
};