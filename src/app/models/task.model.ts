export interface TaskDate {
  start: Date | string | null;
  end: Date | string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  date: TaskDate;
  project: string;
  completed?: boolean;
  priority: string;
  collaboration: string[];
  order: number;
  userId: string;
}
