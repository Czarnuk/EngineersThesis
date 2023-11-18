import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, take } from 'rxjs';
import { Task } from 'src/app/_models/task';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { TaskService } from 'src/app/_services/task.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | undefined;
  @ViewChild('editForm') editForm: NgForm | undefined;
  url: string = '';
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  difficultyName: string[] = ['Easy', 'Medium', 'Hard'];
  skill: string[] = ['SQL (Basic)', 'SQL (Intermediate)', 'SQL (Advanced)', 'C++ (Intermediate)', 'Java (Basic)', 'Java (Intermediate)', 'Problem Solving (Intermediate)'];
  model: any = {};
  submitted = false;
  isAddedMode: boolean | undefined;
  id: number | undefined;
  private photoInQueueSource = new BehaviorSubject<boolean>(false);
  photoInQueue$ = this.photoInQueueSource.asObservable();
  taskManagementMode: boolean = true;
  arrayOfPhotos: FileItem[] = [];
  uploader: FileUploader | undefined;
  baseUrl = environment.apiUrl;
  user: User | undefined;
  newTaskId: number | undefined;
  hasBaseDropZoneOver = false;
  photoUrl: string | undefined;

  constructor(private taskService: TaskService, private toastr: ToastrService, private route: ActivatedRoute, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user
      }
    })
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddedMode = !this.id;
    if (!this.isAddedMode) {
      this.model = this.task;
    }
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  addTask() {
    this.submitted = true;
    this.taskService.add(this.model).subscribe({
      next: response => {
        this.newTaskId = response.id;
        this.editForm?.reset(this.model);
      },
      error: error => this.toastr.error(error.error),
      complete: () => {
        this.toastr.success('Task added successfully');
        this.editForm?.reset(this.model);

        this.uploader?.setOptions({url: this.baseUrl + 'tasks/add-task-photo/' + this.newTaskId})
        // this.uploader!.options!.url = this.baseUrl + 'tasks/add-task-photo/' + this.newTaskId,
        // console.log('UPLOADER!!!', this.uploader);

        this.uploader?.uploadAll();
        this.toastr.success('Photo added successfully');
      }
    });
  }

  initializeUploader(id?: number) {
    if(id) {
      this.photoUrl = this.baseUrl + 'tasks/add-task-photo/' + id;
    } else {
      this.photoUrl = this.baseUrl + 'tasks/add-task-photo/';
    }
    this.uploader = new FileUploader({
      url: this.photoUrl,
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    // this.uploader.onAfterAddingAll = (files: FileItem[]) => {
    //   console.log('ONAFTER: ', this.uploader);
    //   console.log('URL before change: ', this.uploader?.options.url);
    //   this.uploader!.options.url = this.baseUrl + 'tasks/add-task-photo/' + this.newTaskId,
    //   console.log('URL after change: ', this.uploader?.options.url);
    // }

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }
    console.log('URL to controller:', this.uploader);
  }

  updateTask() {
    if (this.id) {
      this.taskService.updateTask(this.id, this.model).subscribe({
        next: _ => {
          this.toastr.success('Task updated successfully');
          this.editForm?.reset(this.model);
        }
      })
    }
  }

  checkIfPhotoAdded(event: boolean) {
    if (event) {
      this.photoInQueueSource.next(event);
    }
  }

  checkArray(event: FileItem[]) {
    for (let index = 0; index < event.length; index++) {
      this.arrayOfPhotos.push(event[index]);
    }
  }

}
