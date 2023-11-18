import { Component, Input } from '@angular/core';
import { Task } from 'src/app/_models/task';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent {
  @Input() task: Task | undefined;

}
