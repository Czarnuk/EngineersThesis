import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/_models/task';
import { TaskService } from 'src/app/_services/task.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent {
  task: Task | undefined;

  constructor(private taskService: TaskService, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.loadTask();
  }

  loadTask() {
    const id = this.route.snapshot.params['id'];
    if(!id) return;
    this.taskService.getTask(id).subscribe({
      next: task => {
        this.task = task;
      }
    });
  }
}
