// this file should be in auth/api/ folder. I hate that weird folder place

import { supabase } from "../../lib/supabase";

export const registerAndCreateWorkspace = async (email: string, password: string, workspaceName: string) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;
  const user = authData.user;
  if (!user) throw new Error("Failed to create user account.");

  //Reg Workplace
  const { data: tenantData, error: tenantError } = await supabase
    .from('tenants')
    .insert([{ name: workspaceName }])
    .select()
    .single();

  if (tenantError) throw tenantError;

  //User LINK - Workplace (ADMIN)
  
  //ADMIN
  const { error: linkError } = await supabase
    .from('tenant_users')
    .insert([{
      tenant_id: tenantData.id,
      user_id: user.id,
      role: 'admin'
    }]);

  if (linkError) throw linkError;

  //Testing Data
  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .insert([{ tenant_id: tenantData.id, name: "First Project", description: "Default project" }])
    .select().single();

  if (!projectError && projectData) {
      await supabase.from('board_columns').insert([
        { tenant_id: tenantData.id, project_id: projectData.id, title: "To Do", position_index: 0 },
        { tenant_id: tenantData.id, project_id: projectData.id, title: "In Progress", position_index: 1 },
        { tenant_id: tenantData.id, project_id: projectData.id, title: "Done", position_index: 2 }
      ]);
  }

  return tenantData;
};
