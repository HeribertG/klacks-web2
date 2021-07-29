import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAuthentication, ChangePassword, ChangeRole, ResponseAuthentication } from '../core/authentification-class';
import { environment } from 'src/environments/environment';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserAdministrationService {

  constructor(private httpClient: HttpClient) { }

  readAccountsList() {
    return this.httpClient
      .get<IAuthentication[]>(
        `${environment.baseUrl}Accounts/`
      )
      .pipe(retry(3));
  }

  getAccount(id: string) {
    return this.httpClient
      .get<IAuthentication>(
        `${environment.baseUrl}Accounts/` + id
      )
      .pipe();
  }

  updateAccount(
    value: IAuthentication
  ) {
    return this.httpClient
      .put<IAuthentication>(
        `${environment.baseUrl}Accounts/`,
        value
      )
      .pipe(retry(3));
  }

  addAccount(
    value: IAuthentication
  ) {
    
    this.copyAccountData(value);

    return this.httpClient
      .post<IAuthentication>(
        `${environment.baseUrl}Accounts/RegisterUser/`,
        value
      )
      .pipe();
  }

  deleteAccount(id: string) {
    return this.httpClient
      .delete<IAuthentication>(
        `${environment.baseUrl}Accounts/` + id
      )
      .pipe(retry(3));

  }


  changePassword(
    value: ChangePassword
  ) {

    return this.httpClient
      .post<IAuthentication>(
        `${environment.baseUrl}Accounts/ChangePasswordUser/`,
        value
      )
      .pipe();
  }

  changeRole(
    value: ChangeRole
  ) {

    return this.httpClient
      .put(
        `${environment.baseUrl}Accounts/ChangeRoleUser`,
        value
      )
      .pipe();
  }

  SentPassword(value: ChangePassword
    )  {

    return this.httpClient
      .put<ResponseAuthentication>(
        `${environment.baseUrl}Accounts/SentPasswordUser`,
        value
      )
      .pipe();
  }




  copyAccountData(value: IAuthentication) {

    let data = `${value.firstName} ${value.lastName}\n`;
    data = data + `Username: ${value.userName}\n`;
    data = data + `Email: ${value.email}\n`;
    data = data + `Password: ${value.password}\n`;


    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = data;
    document.body.appendChild(selBox);

    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
