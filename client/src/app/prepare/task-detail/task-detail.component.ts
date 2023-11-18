import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/_models/task';
import { TaskService } from 'src/app/_services/task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  task: Task | undefined;
  photoUrl: string = "";

  codeMirrorOptions: any = {
    mode: "text/x-mysql",
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    lineWrapping: false,
    extraKeys: { "Ctrl-Space": "autocomplete" },
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true,
    theme: 'material'
  };

  query: string = "";

  constructor(private taskService: TaskService, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.loadTask();
    this.query = `-- SQL Mode for CodeMirror
    SELECT SQL_NO_CACHE DISTINCT
        @var1 AS \`val1\`, @'val2', @global.'sql_mode',
        1.1 AS \`float_val\`, .14 AS \`another_float\`, 0.09e3 AS \`int_with_esp\`,
        0xFA5 AS \`hex\`, x'fa5' AS \`hex2\`, 0b101 AS \`bin\`, b'101' AS \`bin2\`,
        DATE '1994-01-01' AS \`sql_date\`, { T "1994-01-01" } AS \`odbc_date\`,
        'my string', _utf8'your string', N'her string',
            TRUE, FALSE, UNKNOWN
      FROM DUAL
      -- space needed after '--'
      # 1 line comment
      /* multiline
      comment! */
      LIMIT 1 OFFSET 0;`;
        console.log(this.query);
  }

  setEditorContent(event: any) {
    // console.log(event, typeof event);
    console.log(this.query);
  }

  loadTask() {
    const id = this.route.snapshot.params['id'];
    if(!id) return;
    this.taskService.getTask(id).subscribe({
      next: task => {
        this.task = task;
        this.photoUrl = task.photos[0].url
      }
    });
  }
}
