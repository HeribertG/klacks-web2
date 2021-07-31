import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IAuthentication } from 'src/app/core/authentification-class';

@Component({
  selector: 'app-user-administration-row',
  templateUrl: './user-administration-row.component.html',
  styleUrls: ['./user-administration-row.component.scss'],
})
export class UserAdministrationRowComponent implements OnInit {
  @Input() user: IAuthentication|undefined;
  @Input() enabled: boolean= false;
  @Output() isDeleteEvent = new EventEmitter();
  @Output() isChangingEvent = new EventEmitter<boolean>();
  @Output() isSentToEvent = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void { }

  onDelete() {
    this.isDeleteEvent.emit();
  }

  onChange() {
    this.user!.isAdmin = Boolean(this.user!.isAdmin.toString() === 'true');
    this.user!.isAuthorised = Boolean(this.user!.isAuthorised.toString() === 'true');
    this.isChangingEvent.emit(true);
  }

  onClickSentTo() {
    this.isSentToEvent.emit(this.user!.email!);
  }
}
