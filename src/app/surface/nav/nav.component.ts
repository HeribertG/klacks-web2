import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataLoadFileService } from 'src/app/data/data-load-file.service';
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
    @Inject(DataLoadFileService) public dataLoadFileService: DataLoadFileService
  ) { }

  ngOnInit(): void {
    this.tryLoadProfileImage();
    if (localStorage.getItem(MessageLibrary.TOKEN_ADMIN)) {
      this.isAdmin = JSON.parse(localStorage.getItem(MessageLibrary.TOKEN_ADMIN));
    }
    if (localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED)) {
      this.authorised = JSON.parse(localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED));
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

  private tryLoadProfileImage() {

    const id = localStorage.getItem(MessageLibrary.TOKEN_USERID);

    if (id) {

      const imgId = `${id}profile`;

      this.dataLoadFileService.downLoadFile(imgId);
    }
  }
}
