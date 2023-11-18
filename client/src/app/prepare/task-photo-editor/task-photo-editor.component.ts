import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Task } from 'src/app/_models/task';
import { TaskService } from 'src/app/_services/task.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-task-photo-editor',
  templateUrl: './task-photo-editor.component.html',
  styleUrls: ['./task-photo-editor.component.css']
})
export class TaskPhotoEditorComponent {
  @Input() task: Task | undefined;
}
