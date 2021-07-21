import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { DataManagementClientService } from 'src/app/data/management/data-management-client.service';
import { DataManagementInvoiceService } from 'src/app/data/management/data-management-invoice.service';
import { MessageLibrary } from 'src/app/helpers/string-constants';
import { DataManagementSwitchboardService } from 'src/app/data/management/data-management-switchboard.service';
import { DataManagementWorkshopService } from 'src/app/data/management/data-management-workshop.service';
import { DataManagementExportService } from 'src/app/data/management/data-management-export.service';
import { DataLoadFileService } from 'src/app/data/data-load-file.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  registerDropdown: HTMLDivElement;
  selectedName = 'Adresse erfassen';
  authorised = false;
  version = '';

  constructor(

    @Inject(Router) private router: Router,
    @Inject(DataLoadFileService) public dataLoadFileService: DataLoadFileService,
    private auth: AuthService,
    public dataManagementClientService: DataManagementClientService,
    public dataManagementInvoiceService: DataManagementInvoiceService,
    private dataManagementSwitchboardService: DataManagementSwitchboardService,
    private dataManagementWorkshopService: DataManagementWorkshopService,
    private dataManagementExportService: DataManagementExportService,

    private zone: NgZone
  ) { }

  ngOnInit(): void {


    if (localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED)) {
      this.authorised = JSON.parse(localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED));
    }

    if (localStorage.getItem(MessageLibrary.TOKEN_APPVERSION)) {
      this.version = localStorage.getItem(MessageLibrary.TOKEN_APPVERSION);
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

      case 'Export erstellen':
        this.dataManagementExportService.createExport();
        break;

      case 'Kurs erfassen':
        this.dataManagementWorkshopService.createWorkshop();
        break;

      case 'Rechnung erstellen':

        this.router.navigate(['/workplace/invoices']);
        // diese Reset dient dazu da, um eine schon angefangene Einzelrechnung zurückzusetzen
        this.dataManagementInvoiceService.reset();
        break;
      case 'Adresse erfassen':

        this.dataManagementClientService.createClient();

        break;

    }
  }

  refreshPage() {
    this.dataManagementSwitchboardService.refresh();
  }


}
