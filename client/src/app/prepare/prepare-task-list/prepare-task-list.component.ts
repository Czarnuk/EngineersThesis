import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, take } from 'rxjs';
import { Pagination } from 'src/app/_models/pagination';
import { Task } from 'src/app/_models/task';
import { TaskParams } from 'src/app/_models/taskParams';
import { AccountService } from 'src/app/_services/account.service';
import { TaskService } from 'src/app/_services/task.service';

@Component({
  selector: 'app-prepare-task-list',
  templateUrl: './prepare-task-list.component.html',
  styleUrls: ['./prepare-task-list.component.css']
})
export class PrepareTaskListComponent implements OnInit {
  tasks$: Observable<Task[]> | undefined;
  tasks: Task[] | undefined;
  pagination: Pagination | undefined;
  taskParams: TaskParams | undefined;
  // task: Task | undefined;

  constructor(private taskService: TaskService, private accountService: AccountService) { 
    // this.accountService.currentUser$.pipe(take(1)).subscribe({
    //   next: user => {
    //     if(user) {
    //       this.taskParams = new TaskParams();
    //       this.task 
    //     }
    //   }
    // })
    this.taskParams = new TaskParams();
  }

  ngOnInit(): void {
    // this.tasks$ = this.taskService.getTasks();
    this.loadTasks();
  }

  loadTasks(){
    if(!this.taskParams) return;
    this.taskService.getTasks(this.taskParams).subscribe({
      next: response => {
        if(response.result && response.pagination) {
          this.tasks = response.result;
          this.pagination = response.pagination;
        }
      }
    })
  }

  pageChanged(event: any) {
    if (this.taskParams && this.taskParams?.pageNumber !== event.page) {
      this.taskParams.pageNumber = event.page;
      this.loadTasks();
    }
  }
}
