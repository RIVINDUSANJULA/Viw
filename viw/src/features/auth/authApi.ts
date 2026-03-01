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



  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new Error("Session not established. Go to Supabase -> Authentication -> Providers -> Email, and turn OFF 'Confirm email'.");
  }


  // Tenant
  const { data: tenantData, error: tenantError } = await supabase
    .from('tenants')
    .insert([{ name: workspaceName }])
    .select()
    .single();

  if (tenantError) throw new Error(`Tenant DB Error: ${tenantError.message}`);



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


  const defaultColumns = [
    { name: 'To Do', position_index: 0, tenant_id: tenantData.id },
    { name: 'In Progress', position_index: 1, tenant_id: tenantData.id },
    { name: 'Done', position_index: 2, tenant_id: tenantData.id }
  ];

  const { error: columnError } = await supabase
    .from('board_columns')
    .insert(defaultColumns);

  if (columnError) {
    console.error("Failed to create default columns:", columnError);
  }

  return tenantData;
};
