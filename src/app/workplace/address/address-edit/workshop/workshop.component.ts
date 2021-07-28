import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderDirection, HeaderProperties } from 'src/app/core/headerProperties';
import { DataManagementClientService } from 'src/app/data/management/data-management-client.service';
import { DataManagementWorkshopService } from 'src/app/data/management/data-management-workshop.service';
import { MessageLibrary } from 'src/app/helpers/string-constants';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss']
})
export class WorkshopComponent implements OnInit {


  private tmplateArrowDown = '↓';
  private tmplateArrowUp = '↑';
  private tmplateArrowUndefined = '↕';


  arrowName = '';
  arrowDescription = '';
  arrowStart = '';
  arrowEnd = '';

  nameHeader: HeaderProperties = new HeaderProperties();
  descriptionHeader: HeaderProperties = new HeaderProperties();
  startHeader: HeaderProperties = new HeaderProperties();
  endHeader: HeaderProperties = new HeaderProperties();




  constructor(
    public dataManagementClientService: DataManagementClientService,
    private dataManagementWorkshopService: DataManagementWorkshopService,
    private router: Router,
  ) {

  }


  ngOnInit(): void {

    this.reReadSortData();
    this.readPage();
  }

  onPageChange() {
    setTimeout(() => this.readPage(), 100);

  }

  private readPage() {

    this.dataManagementClientService.readPageWorkshop();
  }

  onClickSearch() {
    this.readPage();
  }
  onKeyupSearch(event) {

    if (event.srcElement && event.srcElement.value.toString() === '') { this.onClickSearch(); }

  }

  onClickEdit(data) {

    this.dataManagementWorkshopService.isAllwaysEditable = false;
    this.dataManagementWorkshopService.prepareWorkshop(data);
   
    localStorage.setItem(MessageLibrary.ROUTER_SUBTOKEN, '/workplace/edit-address');
    this.router.navigate(['/workplace/edit-workshop']);
  }

  /* #region   header */

  onClickHeader(orderBy: string) {
    let sortOrder = '';

    if (orderBy === 'name') {
      this.nameHeader.DirectionSwitch();

      if (this.nameHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.nameHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    } else if (orderBy === 'description') {
      this.descriptionHeader.DirectionSwitch();

      if (this.descriptionHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.descriptionHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    } else if (orderBy === 'start') {
      this.startHeader.DirectionSwitch();

      if (this.startHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.startHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    } else if (orderBy === 'end') {
      this.endHeader.DirectionSwitch();

      if (this.endHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.endHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    }


    this.sort(orderBy, sortOrder);
    this.readPage();
  }

  private sort(orderBy: string, sortOrder: string) {
    this.dataManagementClientService.workshopFilter.orderBy = orderBy;
    this.dataManagementClientService.workshopFilter.sortOrder = sortOrder;
    this.setHeaderArrowToUndefined();
    this.setDirection(sortOrder, this.setPosition(orderBy));
    this.setHeaderArrowTemplate();
  }

  private setPosition(orderBy: string): HeaderProperties {
    if (orderBy === 'name') {
      return this.nameHeader;
    }
    if (orderBy === 'description') {
      return this.descriptionHeader;
    }
    if (orderBy === 'start') {
      return this.startHeader;
    }
    if (orderBy === 'end') {
      return this.endHeader;
    }

  }

  private setDirection(sortOrder: string, value: HeaderProperties): void {
    if (sortOrder === 'asc') {
      value.order = HeaderDirection.Down;
    }
    if (sortOrder === 'desc') {
      value.order = HeaderDirection.Up;
    }
  }

  private setHeaderArrowTemplate() {
    this.arrowName = this.setHeaderArrowTemplateSub(this.nameHeader);
    this.arrowDescription = this.setHeaderArrowTemplateSub(this.descriptionHeader);
    this.arrowStart = this.setHeaderArrowTemplateSub(this.startHeader);
    this.arrowEnd = this.setHeaderArrowTemplateSub(this.endHeader);

  }

  private setHeaderArrowTemplateSub(value: HeaderProperties): string {
    switch (value.order) {
      case HeaderDirection.Down:
        return this.tmplateArrowDown;
      case HeaderDirection.Up:
        return this.tmplateArrowUp;
      case HeaderDirection.None:
        return ''; // this.tmplateArrowUndefined;

    }
  }

  private reReadSortData() {
    this.sort(
      this.dataManagementClientService.workshopFilter.orderBy,
      this.dataManagementClientService.workshopFilter.sortOrder);
  }

  private setHeaderArrowToUndefined() {
    this.nameHeader.order = HeaderDirection.None;
    this.descriptionHeader.order = HeaderDirection.None;
    this.startHeader.order = HeaderDirection.None;
    this.endHeader.order = HeaderDirection.None;

  }

  /* #endregion   header */



}
