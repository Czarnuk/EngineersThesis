import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';


@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members$: Observable<Member[]> | undefined;
  filteredMembers: Member[] = []

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.members$ = this.memberService.getMembers();
  }


  filterResults(text: string) {
    this.members$?.pipe(
      map((response: Member[] | null) => {
        const member = response;
        if (member) {
           this.filteredMembers = response.filter(member => member.userName === text);
        }
        return member;
      })
    ).subscribe()
  }

}
