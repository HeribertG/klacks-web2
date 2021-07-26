import { Component, Inject, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {

  isClicked = false;
  username = '';
  password = '';
  token = '';
  showPassword = false;

  constructor(
    @Inject(AuthService) private auth: AuthService,
    @Inject(Router) private router: Router
  ) { }


  async ngAfterViewInit(): Promise<void> {
    // Aufräumen
    localStorage.removeItem('edit-address');
    this.auth.checkIfTokenIsValid();

  }



  async onSave() {

    this.isClicked = true;

    if (await this.auth.logIn(this.username, this.password, this.token)) {


      this.router.navigate(['/workplace']);
      this.isClicked = false;
    } else {
      this.isClicked = false;
    }

  }

}
