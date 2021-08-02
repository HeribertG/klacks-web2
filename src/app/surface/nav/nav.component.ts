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
      this.isAdmin =  JSON.parse(localStorage.getItem(MessageLibrary.TOKEN_ADMIN) as string);
    }
    if (localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED)) {
      this.authorised = JSON.parse(localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED) as  string);
    }
  }


  onClickAddresses(): void {
    this.router.navigate(['/workplace/all-addresses']);
  }
 
  onClickSchedule(): void {

  }

  onClickClients(): void {

  }

  onClickShift(): void {

  }

  onClickAbsences(): void {
    this.router.navigate(['/workplace/absence-calendar']);
    
  }
  
  onClickProfile() : void {
    this.router.navigate(['/workplace/profile']);
  }
  onClickSettings(): void  {
    this.router.navigate(['/workplace/setting']);
  }

  private tryLoadProfileImage() {

    const id = localStorage.getItem(MessageLibrary.TOKEN_USERID);

    if (id) {

      const imgId = `${id}profile`;

      this.dataLoadFileService.downLoadFile(imgId);
    }
  }

 
}
