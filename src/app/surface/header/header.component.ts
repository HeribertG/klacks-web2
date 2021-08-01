import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { DataManagementEmployeeService } from 'src/app/data/management/data-management-employee.service';
import { MessageLibrary } from 'src/app/helpers/string-constants';
import { DataManagementSwitchboardService } from 'src/app/data/management/data-management-switchboard.service';
import { DataLoadFileService } from 'src/app/data/data-load-file.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  selectedName = 'Adresse erfassen';
  authorised = false;
  version = '';

  constructor(
    @Inject(DataLoadFileService) public dataLoadFileService: DataLoadFileService,
    @Inject(Router) private router: Router,
    private auth: AuthService,
    public dataManagementEmployeeService: DataManagementEmployeeService,
    private dataManagementSwitchboardService: DataManagementSwitchboardService,
      private zone: NgZone
  ) { }

  ngOnInit(): void {


    if (localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED)) {
      this.authorised = JSON.parse(localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED )as string);
    }

    if (localStorage.getItem(MessageLibrary.TOKEN_APPVERSION)) {
      this.version = localStorage.getItem(MessageLibrary.TOKEN_APPVERSION) as string;
    }
  }


  onClickDashboard() {
    this.router.navigate(['/workplace/dashboard']);
  }

  onClickLogOut() {
    this.auth.logOut();
  }

  onClickDropdown(name: string) {
    this.zone.run(() => {

      this.selectedName = name;
      this.clickRegister();

    });
  }

  onClickRegister() {

    this.clickRegister();
  }

  private clickRegister() {

    this.dataManagementSwitchboardService.reset();
    this.dataManagementSwitchboardService.isDisabled = false;
    this.dataManagementSwitchboardService.isDirty = false;

    switch (this.selectedName) {

   
      case 'Adresse erfassen':

        this.dataManagementEmployeeService.createEmployee();

        break;

    }
  }

}
