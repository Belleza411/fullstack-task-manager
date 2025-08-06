import { Routes } from "@angular/router";
import { NewTaskComponent } from "./new-task/new-task.component";
import { EditTaskComponent } from "./edit-task/edit-task.component";
import { TasksComponent } from "./tasks.component";

export const tasksRoutes: Routes = [
    {
        path: '',
        component: TasksComponent
    },
    {
        path: 'create',
        component: TasksComponent,
        data: { showCreateModal: true}
    },
    {
        path: ':id/edit',
        component: TasksComponent,
        data: { showEditModal: true }
    }
]