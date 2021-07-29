import { Component, OnInit, EventEmitter, Output, Inject, ViewChild, Input, OnChanges, DoCheck, AfterViewInit } from '@angular/core';
import { DataManagementProfileService } from 'src/app/data/management/data-management-profile.service';
import { checkPasswordStrength, PasswordCheckStrength } from 'src/app/helpers/password';
import { NgForm } from '@angular/forms';
import { MessageLibrary } from 'src/app/helpers/string-constants';


@Component({
  selector: 'app-login-data-edit',
  templateUrl: './login-data-edit.component.html',
  styleUrls: ['./login-data-edit.component.scss']
})
export class LoginDataEditComponent implements OnInit, AfterViewInit, DoCheck {
  @Output() isChangingEvent = new EventEmitter();

  @ViewChild('clientForm', { static: false }) clientForm: NgForm|undefined;

  newPassword1 = '';
  passwordStrength = '';
  public passwordStrengthFlag = false;
  public showOldPassword = false;

  constructor(
    public dataManagementProfileService: DataManagementProfileService) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {

    this.dataManagementProfileService.isReset.subscribe(x => {
      setTimeout(() => this.isChangingEvent.emit(false), 100);
    });
  }

  ngDoCheck() {


    if (this.dataManagementProfileService.changePasswordWrapper!.password === ''
      && this.dataManagementProfileService.changePasswordWrapper!.oldPassword === '') {
      this.passwordStrength = '';
      this.passwordStrengthFlag = false;
      this.newPassword1 = '';
    }


  }


  onKeyUp() {
    if (this.dataManagementProfileService.changePasswordWrapper!.password !== '') {
      const res = checkPasswordStrength(this.dataManagementProfileService.changePasswordWrapper!.password);

      switch (res) {
        case PasswordCheckStrength.Short:
          this.passwordStrength = MessageLibrary.PASSWORD_STRENGTH_SHORT;
          this.passwordStrengthFlag = false;
          break;
        case PasswordCheckStrength.Weak:
          this.passwordStrength = MessageLibrary.PASSWORD_STRENGTH_WEAK;
          this.passwordStrengthFlag = false;
          break;
        case PasswordCheckStrength.Common:
          this.passwordStrength = MessageLibrary.PASSWORD_STRENGTH_WEAK;
          this.passwordStrengthFlag = false;
          break;
        case PasswordCheckStrength.Ok:
          this.passwordStrength = MessageLibrary.PASSWORD_STRENGTH_COMMON;
          this.passwordStrengthFlag = false;
          break;
        case PasswordCheckStrength.Strong:
          this.passwordStrength = MessageLibrary.PASSWORD_STRENGTH_STRONG;
          this.passwordStrengthFlag = true;
          break;
      }
    }
  }

  onChange() {

    if (this.dataManagementProfileService.changePasswordWrapper!.password &&
      (this.dataManagementProfileService.changePasswordWrapper!.password === this.newPassword1) &&
      this.dataManagementProfileService.changePasswordWrapper!.oldPassword) {


      if (this.passwordStrengthFlag) {
        this.dataManagementProfileService.passwordChangeIsAllowed(true);


      } else {
        this.dataManagementProfileService.passwordChangeIsAllowed(false);
      }
    }


    this.isChangingEvent.emit(true);
  }
}
