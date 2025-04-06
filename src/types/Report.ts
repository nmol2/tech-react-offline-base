export interface Report {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'active' | 'archived';
} 