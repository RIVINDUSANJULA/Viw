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