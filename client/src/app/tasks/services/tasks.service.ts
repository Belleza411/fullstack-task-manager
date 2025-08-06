import { inject, Injectable, signal } from '@angular/core';
import { NewTask, Task } from '../models/tasks.model';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '../../core/error/handleError';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private _tasks = signal<Task[]>([]);
  readonly tasks = this._tasks.asReadonly();
  
  private http = inject(HttpClient);
  private url = 'https://localhost:7234/api/Tasks';

  // GET - https://localhost:7234/api/Tasks===
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>
      (this.url).pipe(
          tap({
            next: tasks => {
              this._tasks.set(tasks)
            }
          }),
          catchError(handleError('fetching'))
      )
  }

  // GET - https://localhost:7234/api/Tasks/:id
  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.url}/${id}`).pipe(
        catchError(handleError('fetching tasks'))
    );
  }

  // POST - https://localhost:7234/api/Tasks
  createTask(taskData: NewTask): Observable<Task> {
    return this.http.post<Task>(this.url, taskData).pipe(
        tap(newTask => this._tasks.update(tasks => [...tasks, newTask])),
        catchError(handleError('creating task'))
    );
  }

  // PUT - https://localhost:7234/api/Tasks/:id
  updateTask(id: string, taskData: Partial<NewTask>): Observable<Task> {
    return this.http.put<Task>(`${this.url}/${id}`, taskData).pipe(
        tap((updatedTask) => {
          this._tasks.update(tasks =>
            tasks.map(task => task.taskId === id ? updatedTask : task)
          );
        }),
        catchError(handleError('updating task'))
    );
  }

  // DELETE - https://localhost:7234/api/Tasks/:id
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`).pipe(
      tap(() => {
        this._tasks.update(tasks =>
          tasks.filter(task => task.taskId !== id)
        );
      }),
      catchError(handleError('deleting task'))
    )
  }

}
