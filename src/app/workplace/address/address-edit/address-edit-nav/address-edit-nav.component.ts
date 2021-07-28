import { Component, OnInit } from '@angular/core';
import { IClient } from 'src/app/core/client-class';
import { DataManagementClientService } from 'src/app/data/management/data-management-client.service';
import { MessageLibrary } from 'src/app/helpers/string-constants';

@Component({
  selector: 'app-address-edit-nav',
  templateUrl: './address-edit-nav.component.html',
  styleUrls: ['./address-edit-nav.component.scss']
})
export class AddressEditNavComponent implements OnInit {

  constructor(public dataManagementClientService: DataManagementClientService,) { }

  ngOnInit(): void {
  }


  onAddressTypeName(index: number): string {
    if (this.dataManagementClientService === undefined) { return ''; }
    if (this.dataManagementClientService.editClient === undefined) { return ''; }
    const type = +this.dataManagementClientService.editClient.addresses[index].type;

    let name = '';
    switch (type) {

      case 0:
        name = MessageLibrary.ADDRES_TYPE0_NAME;
        break;
      case 1:
        name = MessageLibrary.ADDRES_TYPE1_NAME;
        break;
      case 2:
        name = MessageLibrary.ADDRES_TYPE2_NAME;
        break;
      default:
        name = MessageLibrary.ADDRES_TYPE_UNDEFINED;

    }

    if (this.dataManagementClientService.
      editClient.addresses[index].id === null || this.dataManagementClientService.editClient.addresses[index].id === '') {
      name = name + ' (neu)';
    }
    return name;
  }

  onClickAdressArray(index: number) {
    this.dataManagementClientService.currentAddressIndex = index;
  }

  onClickPaginationButton(changeValue: number) {
    if (changeValue < 0) {
      if (this.dataManagementClientService.findClientPage > 1) {
        this.dataManagementClientService.findClientPage += changeValue;
        this.dataManagementClientService.readActualSortedClientPage();
      }
    } else if (changeValue > 0) {
      if (this.dataManagementClientService.findClientPage < this.dataManagementClientService.findClientMaxPages) {
        this.dataManagementClientService.findClientPage += changeValue;
        this.dataManagementClientService.readActualSortedClientPage();
      }
    }

  }

  onClickFindClient(value: IClient) {
    this.dataManagementClientService.replaceClient(value.id);

  }

  onClickReset() {
    this.dataManagementClientService.resetFindClient();
  }

  isRestPossible(): boolean {
    if (this.dataManagementClientService.backupFindClient) {
      return true;
    }
    return false;
  }
}
