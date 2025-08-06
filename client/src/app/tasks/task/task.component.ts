import { Component, computed, inject, input } from '@angular/core';
import { NewTask, STATUSES, Task } from '../models/tasks.model';
import { CardComponent } from "../../shared/card/card.component";
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { TasksService } from '../services/tasks.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task',
  imports: [CardComponent, NgClass],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  task = input.required<Task>();
  private router = inject(Router);
  private tasksService = inject(TasksService);
  private toastr = inject(ToastrService)

  statuses: string[] = ['Pending', 'InProgress', 'Completed']; 

  openEditTaskDialog() {
    this.router.navigate(['/tasks', this.task().taskId, 'edit']);
  }

  onDelete(taskId: string) {
    this.tasksService.deleteTask(taskId).subscribe({
      next: () => this.toastr.success('Task deleted successfully!'),
      error: err => console.log(err)
    })   
  }

  onStatusChange(taskId: string, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value as STATUSES;
    
    if (!taskId || !newStatus) return;

    const updatedTask: NewTask = {
      taskName: this.task().taskName,
      taskDescription: this.task().taskDescription,
      taskStatus: newStatus,
      taskPriority: this.task().taskPriority,
      dueDate: this.task().dueDate
    }

    this.tasksService.updateTask(taskId, updatedTask).subscribe({
      error: (err) => console.error('❌ Error updating status:', err)
    });
  }

  getDueDateClass(): string {
    const dueDateStr = this.task().dueDate;
    if (!dueDateStr) return '';

    const dueDate = new Date(dueDateStr);
    const now = new Date();

    if (isNaN(dueDate.getTime())) return '';

    const timeLeftMs = dueDate.getTime() - now.getTime();
    const timeLeftMinutes = timeLeftMs / (1000 * 60);
    const timeLeftHours = timeLeftMinutes / 60;
    const timeLeftDays = timeLeftHours / 24;

    if (timeLeftDays >= 3) return 'three-days';
    if (Math.floor(timeLeftDays) === 2) return 'two-days';
    if (Math.floor(timeLeftDays) === 1) return 'one-day';
    if (timeLeftMinutes < 0) return 'overdue';

    return '';
  }

  getPriorityColor(): string {
    switch(this.task().taskPriority) {
      case 'Low': 
        return 'low'
      case 'Medium':
        return 'medium';
      case 'High':
        return 'high'
    }
  }

  getStatusColor() {
    switch(this.task().taskStatus) {
      case 'Pending': return 'status-pending'
      case 'InProgress': return 'status-in-progress'
      case 'Completed': return 'status-completed'
    }
  }
}
