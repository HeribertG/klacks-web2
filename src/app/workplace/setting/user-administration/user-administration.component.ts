import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  NgZone,
  OnChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataManagementSettingsService } from 'src/app/data/management/data-management-settings.service';
import {
  IAuthentication,
  Authentication,
  ChangePassword,
} from 'src/app/core/authentification-class';
import { NgForm } from '@angular/forms';
import { generatePassword } from 'src/app/helpers/password';
import { MessageLibrary } from 'src/app/helpers/string-constants';

@Component({
  selector: 'app-user-administration',
  templateUrl: './user-administration.component.html',
  styleUrls: ['./user-administration.component.scss'],
})
export class UserAdministrationComponent implements OnInit {
  @ViewChild(NgForm, { static: false }) modalForm: NgForm | undefined;
  @Output() isChangingEvent = new EventEmitter<boolean>();

  newUser: IAuthentication | undefined;
  disabled = true;
  currentEmail = '';

  constructor(
    private modalService: NgbModal,
    private zone: NgZone,
    public dataManagementSettingsService: DataManagementSettingsService
  ) { }

  ngOnInit(): void { }

  onChange() {
    if (this.newUser) {
      if (
        (this.newUser.firstName && this.newUser.firstName !== '') &&
        (this.newUser.lastName && this.newUser.lastName !== '') &&
        (this.newUser.userName && this.newUser.userName !== '') &&
        (this.newUser.email && this.newUser.email !== '')

      ) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    }
  }

  onIsChanging(event: boolean) {
    this.isChangingEvent.emit(event);
  }

  onDelete(index: number) {
    const user = this.dataManagementSettingsService.accountsList[index];
    this.dataManagementSettingsService.deleteAccount(user.id!);
  }

  onSentTo(event: string) {
    this.currentEmail = event;
  }

  openMsg(content: any) {
    this.newUser = new Authentication();
    this.modalService.open(content, { size: 'sm', centered: true }).result.then(
      (x) => {

        const c = new ChangePassword();
        c.email = this.currentEmail;
        c.password = generatePassword();
        c.token = localStorage.getItem(MessageLibrary.TOKEN) as string;

        this.dataManagementSettingsService.sentPassword(c);
      },
      (reason) => { this.currentEmail = ''; }
    );
  }


  open(content: any) {
    this.newUser = new Authentication();
    this.disabled = true;

    this.modalService.open(content, { size: 'md', centered: true }).result.then(
      (x) => {
        this.newUser!.password = generatePassword();
        this.dataManagementSettingsService.addAccount(this.newUser!);
      },
      (reason) => { }
    );
  }
}
