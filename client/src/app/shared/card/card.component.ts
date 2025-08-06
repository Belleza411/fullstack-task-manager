import { Component, input } from '@angular/core';
import { Task } from '../../tasks/models/tasks.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [NgClass],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  task = input.required<Task>();
  getStatusColor() {
    switch(this.task().taskStatus) {
      case 'Pending': return 'pending'
      case 'InProgress': return 'in-progress'
      case 'Completed': return 'completed'
    }
  }
}
