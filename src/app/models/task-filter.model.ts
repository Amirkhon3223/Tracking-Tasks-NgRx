export interface TaskFilterForm {
  completed: '';
  executor: string;
  priority: string;
  deadline: {
    start: Date;
    end: Date;
  };
}
