export interface Project {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
}
export interface Task {
  id: string;
  tenant_id: string;
  project_id: string;
  column_id: string;
  title: string;  // Changed from 'content' to match SQL
  position_index: number;
  description?: string;
  assignee_id?: string | null;
  tenants?: { 
    name: string 
  };
  attachment_url?: string | null;

}

export type Id = string;


export interface Column {
  id: string;
  tenant_id: string;
  title: string;
  position_index: number;
}

export interface ColumnType {
  id: string;
  title: string;

  
  tenant_id: string;
  position_index: number;
}


export interface WorkspaceMember {
  user_id: string;
  role: string;
  email?: string; 
}


export interface StorageFile {
  id: string;
  name: string;
}