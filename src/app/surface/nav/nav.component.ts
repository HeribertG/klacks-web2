import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageLibrary } from 'src/app/helpers/string-constants';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  profileImage: any;
  isAdmin = false;
  authorised = false;

  constructor(
    @Inject(Router) private router: Router,
  ) { }

  ngOnInit(): void {
     
    if (localStorage.getItem(MessageLibrary.TOKEN_ADMIN)) {
      this.isAdmin = JSON.parse(localStorage.getItem(MessageLibrary.TOKEN_ADMIN) as string);
    }
    if (localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED)) {
      this.authorised = JSON.parse(localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED) as  string);
    }
  }


  onClickAddresses() {
    this.router.navigate(['/workplace/all-addresses']);
  }
  onClickWorkshops() {
    this.router.navigate(['/workplace/all-workshops']);
  }
  onClickDocuments() {
    this.router.navigate(['/workplace/all-documents']);
  }
  onClickInvoices() {
    this.router.navigate(['/workplace/all-invoices']);
  }
  onClickProfile() {
    this.router.navigate(['/workplace/profile']);
  }
  onClickSettings() {
    this.router.navigate(['/workplace/settings']);
  }

  onClickReminder() {
    this.router.navigate(['/workplace/reminder']);
  }

  onClickExport() {
    this.router.navigate(['/workplace/all-exports']);
  }

 
}
