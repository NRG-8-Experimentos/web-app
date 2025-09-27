export interface MemberTask {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  groupId?: number;
  member?: {
    id: number;
    name: string;
    surname: string;
    urlImage?: string;
  };
}
