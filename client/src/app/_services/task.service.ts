import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Task } from '../_models/task';
import { map, of, reduce } from 'rxjs';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { PaginatedResult } from '../_models/pagination';
import { TaskParams } from '../_models/taskParams';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  baseUrl = environment.apiUrl;
  tasks: Task[] = [];
  uploader: FileUploader | undefined;
  taskCache = new Map();

  constructor(private http: HttpClient) { }

  getTasks(taskParams: TaskParams) {
    const response = this.taskCache.get(Object.values(taskParams).join('-'));
    if(response) return of(response);
    let params = getPaginationHeaders(taskParams.pageNumber, taskParams.pageSize);
    return getPaginatedResult<Task[]>(this.baseUrl + 'tasks', params, this.http).pipe(
      map(response => {
        this.taskCache.set(Object.values(taskParams).join('-'), response);
        return response;
      })
    );
  }

  getTask(id: number) {
    const task = [...this.taskCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((task: Task) => task.id === id);
    if (task) return of(task);
    return this.http.get<Task>(this.baseUrl + 'tasks/' + id);
  }

  add(model: any) {
    return this.http.post<Task>(this.baseUrl + 'tasks/add', model);
  }

  updateTask(id: number, task: Task) {
    return this.http.put(this.baseUrl + 'tasks/' + id, task).pipe(
      map(() => {
        const index = this.tasks.indexOf(task);
        this.tasks[index] = { ...this.tasks[index], ...task };
      })
    );
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'tasks/delete-task-photo/' + photoId);
  }
}
