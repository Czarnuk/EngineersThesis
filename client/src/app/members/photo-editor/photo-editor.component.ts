import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { Task } from 'src/app/_models/task';
import { TaskPhoto } from 'src/app/_models/taskPhoto';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { TaskService } from 'src/app/_services/task.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Output() photoAdded = new EventEmitter<boolean>();
  @Output() arrayOfPhotos = new EventEmitter<FileItem[]>();
  @Output() childUploader = new EventEmitter<FileUploader>();
  @Input() task: Task | undefined;
  @Input() member: Member | undefined;
  @Input() taskManagementMode: boolean | undefined;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;
  url: string = '';

  constructor(private accountService: AccountService, private memberService: MembersService, private taskService: TaskService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user
      }
    })
  }
  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user && this.member) {
          this.user.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
          this.member.photoUrl = photo.url;
          this.member.photos.forEach(p => {
            if (p.isMain) p.isMain = false;
            if (p.id === photo.id) p.isMain = true;
          })
        }
      }
    })
  }

  initializeUploader() {
    const id = this.task?.id;
    // if (this.task) {
    //   this.url = this.baseUrl + 'tasks/add-task-photo/' + id;
    // } else if (this.member)
    //   this.url = this.baseUrl + 'users/add-photo';

    if (this.member) {
      this.url = this.baseUrl + 'users/add-photo';
    } else if (this.task) {
      this.url = this.baseUrl + 'tasks/add-task-photo/' + id;
    } else {
      this.url = '';
    }
    this.uploader = new FileUploader({
      url: this.url,
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      console.log(this.uploader);

      if (response) {
        const photo = JSON.parse(response);
        if (this.member) {
          this.member?.photos.push(photo);
          if (photo.isMain && this.user && this.member) {
            this.user.photoUrl = photo.url;
            this.member.photoUrl = photo.url;
            this.accountService.setCurrentUser(this.user);
          }
        } else if (this.task) {
          this.task?.photos.push(photo);
        }
      }
    }
  }

  deleteMemberPhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        if (this.member) {
          this.member.photos = this.member.photos.filter(x => x.id != photoId);
        }
      }
    })
  }

  deleteTaskPhoto(photoId: number) {
    this.taskService.deletePhoto(photoId).subscribe({
      next: () => {
        if (this.task) {
          this.task.photos = this.task.photos.filter(x => x.id != photoId);
        }
      }
    })
  }

  get uploaderQueueLength(): number {
    const photoCounter = this.uploader?.queue?.length;
    this.arrayOfPhotos.emit(this.uploader?.queue);
    if (photoCounter && photoCounter > 0) {
      this.photoAdded.emit(true);
      this.childUploader.emit(this.uploader);
    }
    return this.uploader?.queue?.length || 0;
  }

  // get getPhotos(): FileItem[] {
  //   if(this.uploader?.queue) {
  //     const photos = this.uploader.queue;
  //     this.arrayOfPhotos.emit(photos);
  //   }
  //   console.log('PHTOS: ', this.arrayOfPhotos);
  //   return this.uploader?.queue || [];
  // }
}
