import { Injectable } from '@angular/core';
import { Task } from '../../models/task.model';
import { delay, Observable, of } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor() {
  }

  getTasks(userId: string): Observable<Task[]> {
    const tasks = this.getItem<Task[]>('tasks') || [];
    // Возвращаем задачи, где текущий пользователь - владелец или упомянут в collaboration
    const accessibleTasks = tasks.filter(task =>
      task.userId === userId || task.collaboration.includes(userId)
    );
    return of(accessibleTasks).pipe(delay(100));
  }

  addTask(task: Task, userId: string): Observable<{ tasks: Task[] }> {
    const tasks = this.getItem<Task[]>('tasks') || [];
    const newTask = {...task, id: uuid(), userId};
    tasks.push(newTask);
    this.setItem('tasks', tasks);
    return of({tasks}).pipe(delay(100));
  }

  deleteTask(taskId: string, userId: string): Observable<{ tasks: Task[] }> {
    let tasks = this.getItem<Task[]>('tasks') || [];
    tasks = tasks.filter(task => task.id !== taskId && task.userId === userId);
    this.setItem('tasks', tasks);
    return of({tasks}).pipe(delay(100));
  }

  updateTask(task: Task, userId: string): Observable<Task[]> {
    let tasks = this.getItem<Task[]>('tasks') || [];
    const index = tasks.findIndex(t => t.id === task.id && t.userId === userId);
    if (index !== -1) {
      tasks[index] = {...task, userId};
      this.setItem('tasks', tasks);
    }
    return of(tasks).pipe(delay(100));
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
