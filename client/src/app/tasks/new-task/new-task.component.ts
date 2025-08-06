import { Component, computed, inject } from '@angular/core';
import { TaskFormComponent } from "../../shared/task-form/task-form.component";
import { ReactiveFormsModule } from '@angular/forms';
import { TasksService } from '../services/tasks.service';

@Component({
  selector: 'app-new-task',
  imports: [TaskFormComponent, ReactiveFormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css'
})
export class NewTaskComponent {

}
