import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { MessageLibrary } from '../helpers/string-constants';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { MyToken } from '../core/authentification-class';
import { EqualDate } from '../helpers/format-helper';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public toastService: ToastService,
    private httpClient: HttpClient,
    private router: Router) { }



  async logIn(userName: string, password: string, token: string): Promise<boolean> {

    const user = {
      email: userName,
      password,
      token
    };

    return await this.httpClient.post<MyToken>(
      `${environment.baseUrl}Accounts/LoginUser`, user).toPromise()
      .then((tok:any) => {

        if (tok === null) {
          this.showInfo(MessageLibrary.AUTH_USER_ERROR + MessageLibrary.RESPONSE_ERROR, 'AUTH_USER_ERROR');
          return false;
        }

        if (tok && typeof tok === 'object'  && tok['user not exist']) {
          this.showInfo(MessageLibrary.AUTH_USER_NOT_EXIST);
          return false;
        } else {
          this.storeToken(tok);
          return true;
        }

      })
      .catch(err => {
        this.showError(MessageLibrary.AUTH_USER_ERROR, 'AUTH_USER_ERROR');
        console.log(err);
        return false;
      });
  }

  async refreshToken() {
    const rt = localStorage.getItem(MessageLibrary.TOKEN_REFRESHTOKEN) !== null;
    if (rt) {
      const refreshRequest = {
        token: localStorage.getItem(MessageLibrary.TOKEN),
        refreshToken: localStorage.getItem(MessageLibrary.TOKEN_REFRESHTOKEN)
      };


      return await this.httpClient.post<MyToken>(
        `${environment.baseUrl}Accounts/RefreshToken`, refreshRequest).toPromise()
        .then(token => {

          if (token === null) {
            this.showInfo(MessageLibrary.AUTH_USER_ERROR + MessageLibrary.RESPONSE_ERROR);
            this.logOut();
            return false;
          }
          if (!token.success) {
            this.showError(token.errorMessage);
            this.logOut();
            return false;
          }

          this.storeToken(token, true);
          return true;


        })
        .catch(err => {
          this.showError(MessageLibrary.AUTH_USER_ERROR);
          console.log(err);
          return false;
        });
    } else {

      this.logOut();
      return false;
    }
  }


  logOut() {
    this.removeToken();
    this.router.navigate(['/']);
  }

  authenticated(): boolean {
    const res = localStorage.getItem(MessageLibrary.TOKEN) !== null;
    return res;
  }

  isAuthorised(url: string): boolean {

    switch (url) {
      case '/workplace/settings':
        return this.isAdmin();

      default:
        return true;
    }

  }



  checkIfTokenIsValid(): void {

    const token = localStorage.getItem(MessageLibrary.TOKEN);
    if (token !== null) {
      const currentDate = new Date();
      const tokenDate = new Date(localStorage.getItem(MessageLibrary.TOKEN_EXP) as string);

      const res = EqualDate(currentDate, tokenDate);
      if (res <= 0) {
        try {
          this.refreshToken().then(x => {
            if (x === true) {
              this.router.navigate(['/workplace']);
            } else {
              this.logOut();
            }
          });
        } catch {

          this.router.navigate(['/']);
          this.showInfo(MessageLibrary.EXPIRED_TOKEN);
        }
      } else {
        this.router.navigate(['/workplace']);
      }
    } else {
      this.logOut();
    }

  }

  errorMessage(error: string, message?: string) {
    console.log(error);

    switch (error) {
      case 'Unknown Error':
        this.router.navigate(['/error']);
        this.showError(MessageLibrary.SERVER_NOT_VALID);

        break;

      case '200':
        this.showInfo(message as string);
        break;

      case '204':
        this.showInfo(MessageLibrary.HTTP204);
        break;

      case '400':
        this.showError(MessageLibrary.HTTP400);

        break;

      case '401':
        this.logOut();
        this.router.navigate(['/']);
        this.showError(MessageLibrary.HTTP401);

        break;

      case '403':
        this.showError(MessageLibrary.HTTP403);

        break;

      case '404':
        this.router.navigate(['/error']);
        this.showError(MessageLibrary.HTTP404);

        break;

      default:
        this.router.navigate(['/error']);
        this.showError(MessageLibrary.UNKNOW_ERROR);

    }

  }


  private storeToken(token: MyToken, isRefresh?: boolean) {
    this.removeToken(isRefresh);

    localStorage.setItem(MessageLibrary.TOKEN, token.token);
    localStorage.setItem(MessageLibrary.TOKEN_SUBJECT, token.subject);
    localStorage.setItem(MessageLibrary.TOKEN_USERNAME, token.username);
    localStorage.setItem(MessageLibrary.TOKEN_USERID, token.id);
    localStorage.setItem(MessageLibrary.TOKEN_EXP, token.expTime!.toString());
    localStorage.setItem(MessageLibrary.TOKEN_ADMIN, token.isAdmin.toString());
    localStorage.setItem(MessageLibrary.TOKEN_AUTHORISED, token.isAuthorised.toString());
    localStorage.setItem(MessageLibrary.TOKEN_APPVERSION, token.version);
    if (token.refreshToken) { localStorage.setItem(MessageLibrary.TOKEN_REFRESHTOKEN, token.refreshToken); }




  }

  private removeToken(isRefresh?: boolean) {
    try {
      localStorage.removeItem(MessageLibrary.TOKEN);
      localStorage.removeItem(MessageLibrary.TOKEN_EXP);
      localStorage.removeItem(MessageLibrary.TOKEN_SUBJECT);
      localStorage.removeItem(MessageLibrary.TOKEN_USERNAME);
      localStorage.removeItem(MessageLibrary.TOKEN_USERID);
      localStorage.removeItem(MessageLibrary.TOKEN_ADMIN);
      localStorage.removeItem(MessageLibrary.TOKEN_AUTHORISED);
      localStorage.removeItem(MessageLibrary.TOKEN_APPVERSION);

      if (!isRefresh) {
        localStorage.removeItem(MessageLibrary.TOKEN_REFRESHTOKEN);
        // Aufräumen
        localStorage.removeItem('edit-address');
      }
    } catch (e) {

    }



  }

  private isAdmin(): boolean {
    let admin = false;

    if (localStorage.getItem(MessageLibrary.TOKEN_ADMIN)) {
      admin = JSON.parse(localStorage.getItem(MessageLibrary.TOKEN_ADMIN) as string);
    }

    return admin;
  }


  showError(Message: string, errorName = '') {
    if (errorName) {
      const y = this.toastService.toasts.find(x => x.name === errorName);
      this.toastService.remove(y);
    }

    this.toastService.show(Message, {
      classname: 'bg-danger text-light',
      delay: 3000,
      name: errorName,
      autohide: true,
      headertext: 'Fehler'
    });
  }

  showInfo(Message: string, infoName = '') {
    if (infoName) {
      const y = this.toastService.toasts.find(x => x.name === infoName);
      this.toastService.remove(y);
    }
    this.toastService.show(Message, {
      classname: 'bg-info text-light',
      delay: 5000,
      name: infoName,
      autohide: true,
      headertext: 'Info'
    });
  }
}
