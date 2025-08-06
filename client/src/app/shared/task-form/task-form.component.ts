import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewTaskComponent } from '../../tasks/new-task/new-task.component';
import { EditTaskComponent } from '../../tasks/edit-task/edit-task.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewTask, PRIORITIES, STATUSES, Task } from '../../tasks/models/tasks.model';
import { TasksService } from '../../tasks/services/tasks.service';
import { formatDateForInput } from '../../core/utils/formatDate';
import { isFieldError } from '../../core/error/isFieldError';
import { ErrorMessageComponent } from "../error-message/error-message.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, ErrorMessageComponent],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {
  private tasksService = inject(TasksService);
  private toastr = inject(ToastrService);
  isCreate = input<boolean>();
  private dialogRef = inject(MatDialogRef<NewTaskComponent | EditTaskComponent>, { optional: true });
  public data = inject(MAT_DIALOG_DATA) as { task: Task }
  private taskId: string = '';

  statuses = signal<STATUSES[]>(['Pending', 'InProgress', 'Completed']);
  priorities = signal<PRIORITIES[]>(['Low', 'Medium', 'High']);
  
  form = new FormGroup({
    taskName: new FormControl('',[Validators.required]),
    taskDescription: new FormControl('',[Validators.required, Validators.maxLength(255)]),
    taskStatus: new FormControl<STATUSES>('Pending', [Validators.required]),
    taskPriority: new FormControl<PRIORITIES>('Medium', [Validators.required]),
    dueDate: new FormControl('')
  })

   ngOnInit() {
    if (this.data && this.data.task) {
      const task = this.data.task;
      this.taskId = task.taskId;

      this.form.patchValue({
        taskName: task.taskName,
        taskDescription: task.taskDescription,
        taskStatus: task.taskStatus,
        taskPriority: task.taskPriority,
        dueDate: task.dueDate ? formatDateForInput(task.dueDate) : null
      });
    }
  }

  hasError(fieldName: string, errorType: string) {
    return isFieldError(this.form, fieldName, errorType)
  }
  
  onCloseModal() {
    if(this.dialogRef) {
      this.dialogRef.close()
    }
  }

  onSubmit() {  
    console.log('clicked');
    
    if(this.form.invalid) return;

    const newTask = this.form.value as NewTask;

    if(this.isCreate()) {      
      this.tasksService.createTask(newTask).subscribe({
        next: () => {
          this.onCloseModal(),
          this.toastr.success('Task created successfully!');
        },
        error: err => console.log('Error: ' + err)        
      });
    } else {
      this.tasksService.updateTask(this.taskId, newTask).subscribe({
        next: () => {
          this.onCloseModal(),
          this.toastr.success('Task updated successfully!')
        },
        error: err => console.log('Error: ' + err)
      });;
    }
  }
}
