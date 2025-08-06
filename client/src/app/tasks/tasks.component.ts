import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskComponent } from "./task/task.component";
import { TasksService } from './services/tasks.service';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from './new-task/new-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-tasks',
  imports: [ TaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit, OnDestroy {
  private tasksService = inject(TasksService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  tasks = computed(() => this.tasksService.tasks());

  ngOnInit() {
    this.checkTokenAndLoadTasks();

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(paramMap => {
        const id = paramMap.get('id');
        const showEditModal = this.route.snapshot.data['showEditModal'];
        const showCreateModal = this.route.snapshot.data['showCreateModal'];
        
        if (showCreateModal) {
          this.openCreateTaskDialog();
        } else if (showEditModal && id) {
          this.openEditTaskDialog(id);    
        }
      });
  }

  private checkTokenAndLoadTasks() {
    const accessToken = this.authService.getToken();
    const refreshToken = this.authService.getRefreshToken();
        
    if (!accessToken && !refreshToken) {
      this.authService.logout();
      return;
    }
    
    this.tasksService.getAllTasks().subscribe({
      error: err => console.log(err)
    });
  }

  openCreateTaskDialog() {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.router.navigate(['/tasks'])
      });
  }

  openEditTaskDialog(taskId: string) {
    const taskToEdit = this.tasks().find(task => task.taskId === taskId);
    
    if (!taskToEdit) {
      this.router.navigate(['/tasks']);
      return;
    }

    const dialogRef = this.dialog.open(EditTaskComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      data: { task: taskToEdit }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.router.navigate(['/tasks']);
      });
  }

  onCreateClick() {
    this.router.navigate(['/tasks/create'])
  }

  ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
  }
}
