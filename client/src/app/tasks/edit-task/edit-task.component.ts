import { Component, inject } from '@angular/core';
import { TaskFormComponent } from "../../shared/task-form/task-form.component";
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../services/tasks.service';

@Component({
  selector: 'app-edit-task',
  imports: [TaskFormComponent],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent {

}
