import { Component, OnInit, Input, IterableDiffers, OnDestroy, HostListener, ViewChild, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { CheckBoxValue, IFilterEmployee, IEmployee } from 'src/app/core/employee-class';
import { DataManagementEmployeeService } from 'src/app/data/management/data-management-employee.service';
import { Router } from '@angular/router';
import { HeaderProperties, HeaderDirection } from 'src/app/core/headerProperties';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageLibrary } from 'src/app/helpers/string-constants';
import { saveFilter, restoreFilter, copyObjectValues } from 'src/app/helpers/object-helpers';
import { InitFinished } from 'src/app/helpers/enums/client-enum';

import { measureTableHeight } from 'src/app/helpers/tableResize';




@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss'],

})
export class AddressListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('myTable', { static: false }) myTable: ElementRef | undefined;



  highlightRowId: string | null = null;
  page = 1;
  firstItemOnLastPage: number | null = null;
  isPreviousPage: boolean | null = null;
  isNextPage: boolean | null = null;

  numberOfItemsPerPage = 5;
  numberOfItemsPerPageMap = new Map();

  private tmplateArrowDown = '↓';
  private tmplateArrowUp = '↑';
  private tmplateArrowUndefined = '↕';

  arrowNo = '';
  arrowCompany = '';
  arrowFirstName = '';
  arrowName = '';
  arrowStatus = '';

  numberHeader: HeaderProperties = new HeaderProperties();
  companyHeader: HeaderProperties = new HeaderProperties();
  firstNameHeader: HeaderProperties = new HeaderProperties();
  nameHeader: HeaderProperties = new HeaderProperties();
  statusHeader: HeaderProperties = new HeaderProperties();

  orderBy = 'name';
  sortOrder = 'asc';

  message = MessageLibrary.DELETE_ENTRY;
  checkBoxIndeterminate = false;
  iterableDiffer: any;
  isAuthorised = false;


  tableSize: DOMRectReadOnly | undefined;
  isMeasureTable = false;
  isFirstRead = true;



  resizeWindow: (() => void) | undefined;





  @HostListener('search', ['$event']) onsearch(event: KeyboardEvent) {

    if (this.dataManagementEmployeeService.currentFilter.searchString === '') {
      localStorage.removeItem('edit-address');
    }
    this.onClickSearch();
  }

  constructor(
    private modalService: NgbModal,
    public dataManagementEmployeeService: DataManagementEmployeeService,
    private router: Router,
    private iterableDiffers: IterableDiffers,
    private renderer: Renderer2,

  ) { this.iterableDiffer = iterableDiffers.find([]).create(undefined); }

  ngOnInit(): void {


    if (localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED)) {
      this.isAuthorised = JSON.parse(localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED) as string);
    }

    this.reReadSortData();
    this.dataManagementEmployeeService.init();


    window.addEventListener('resize', this.resize, true);

  }

  ngAfterViewInit(): void {

    setTimeout(() => this.recalcHeight(), 600);

    this.getReset();

    this.resizeWindow = this.renderer.listen('window', 'resize', (event) => {
      this.resize(event);
    });

    if (this.dataManagementEmployeeService.initCount === InitFinished.Finished) {
      this.isInit();
    }

    this.dataManagementEmployeeService.iniIsRead.subscribe(() => {
      this.isInit();
    });

    this.dataManagementEmployeeService.isRead.subscribe(x => {
      if (this.isFirstRead) {
        setTimeout(() => this.recalcHeight(), 100);
        this.isFirstRead = false;
        return;
      }
      this.isMeasureTable = true;
    });

  }



  ngOnDestroy(): void {

    this.iterableDiffer = null;
    try {

      if (this.resizeWindow) { this.resizeWindow(); }
    } catch {
      this.resizeWindow = undefined;
    }

  }


  private isInit(): void {
    const tmp = restoreFilter('edit-address');


    if (!tmp) {
      this.dataManagementEmployeeService.currentFilter.setEmpty();
      this.recalcHeight();

    } else {
      this.restoreFilter(tmp);
      this.page = this.dataManagementEmployeeService.currentFilter.requiredPage + 1;
      this.recalcHeight();
    }
  }

  /* #region   resize */

  private getReset(): void {

    this.page = 1;
    this.dataManagementEmployeeService.currentFilter.firstItemOnLastPage = 0;
    this.dataManagementEmployeeService.currentFilter.isPreviousPage = null;
    this.dataManagementEmployeeService.currentFilter.isNextPage = null;

    setTimeout(() => this.recalcHeight(), 100);
  }

  onResize(event: DOMRectReadOnly): void {
    this.tableSize = event;
    if (this.isMeasureTable) {
      this.isMeasureTable = false;
      setTimeout(() => this.recalcHeight(true), 100);
    }
  }


  private resize = (event: any): void => {
    setTimeout(() => this.recalcHeight(), 100);
  }

  private recalcHeight(isSecondRead: boolean = false) {

    const addLine = measureTableHeight(this.myTable!);

    const tmpNumberOfItemsPerPage = this.numberOfItemsPerPage;

    if (this.page * addLine! < this.dataManagementEmployeeService.maxItems) {
      this.numberOfItemsPerPage = 5;
      if (addLine! > 5) {
        this.numberOfItemsPerPage = addLine!;
      }
    }

    if (!isSecondRead) {
      this.readPage();
    } else {
      if (tmpNumberOfItemsPerPage !== this.numberOfItemsPerPage) {
        this.readPage(true);
      }
    }
  }


  /* #endregion   resize */

  onClickedRow(value: IEmployee) {

    //  this.highlightRowId = value.id;
  }



  onLostFocus() {
    this.highlightRowId = null;
  }

  onPageChange(event: number) {

    this.firstItemOnLastPage = null;
    this.isPreviousPage = null;
    this.isNextPage = null;

    if (event === this.page + 1) {
      this.isNextPage = true;

      if (!this.numberOfItemsPerPageMap.get(this.page)) { this.numberOfItemsPerPageMap.set(this.page, this.numberOfItemsPerPage); }

      this.firstItemOnLastPage = this.dataManagementEmployeeService.firstItem;
    } else if (event === this.page - 1) {
      this.isPreviousPage = true;
      this.firstItemOnLastPage = this.dataManagementEmployeeService.firstItem;
    }

    setTimeout(() => {
      this.page = event;
      this.recalcHeight();
    }, 100);

  }

  private readPage(isSecondRead: boolean = false) {

    if (!isSecondRead) {
      const lastNumberOfItemsPerPage = this.numberOfItemsPerPageMap.get(this.page);
      if (lastNumberOfItemsPerPage) {
        this.dataManagementEmployeeService.currentFilter.numberOfItemOnPreviousPage = null;
        this.dataManagementEmployeeService.currentFilter.numberOfItemOnPreviousPage = lastNumberOfItemsPerPage;
      }
    }

    this.dataManagementEmployeeService.currentFilter.firstItemOnLastPage = this.firstItemOnLastPage;
    this.dataManagementEmployeeService.currentFilter.isPreviousPage = this.isPreviousPage;
    this.dataManagementEmployeeService.currentFilter.isNextPage = this.isNextPage;

    this.dataManagementEmployeeService.currentFilter.orderBy = this.orderBy;
    this.dataManagementEmployeeService.currentFilter.sortOrder = this.sortOrder;
    this.dataManagementEmployeeService.currentFilter.requiredPage = this.page - 1;
    this.dataManagementEmployeeService.currentFilter.numberOfItemsPerPage = this.numberOfItemsPerPage;

    this.dataManagementEmployeeService.readPage(isSecondRead);
  }



  private restoreFilter(value: IFilterEmployee) {

    copyObjectValues(this.dataManagementEmployeeService.currentFilter, value);

    const countriesArray = this.dataManagementEmployeeService.currentFilter.countries;
  }

  onClickEdit(data: IEmployee) {

    saveFilter(this.dataManagementEmployeeService.currentFilter, 'edit-address');
    this.dataManagementEmployeeService.prepareEmployee(data);
    this.router.navigate(['/workplace/edit-address']);

  }

  onClickSearch() {
    this.readPage();
  }

  onKeyupSearch(event: any) {

    if (event.srcElement && event.srcElement.value.toString() === '') { this.onClickSearch(); }

  }



  onFluctuationEnabled(): boolean {

    const tmp = this.dataManagementEmployeeService.currentFilter.scopeFromFlag !== null &&
      this.dataManagementEmployeeService.currentFilter.scopeUntilFlag !== null &&
      this.dataManagementEmployeeService.currentFilter.internalScopeFrom !== null &&
      this.dataManagementEmployeeService.currentFilter.internalScopeUntil !== null;

    return tmp;
  }



  /* #region   MsgBox */
  open(content:any, data: IEmployee) {


    this.modalService.open(content, { size: 'sm', centered: true }).result.then(
      (x) => {
        // tslint:disable-next-line: deprecation
        this.dataManagementEmployeeService.deleteEmployee(data.id!).subscribe(() => {

          this.readPage();
       
        });

      },
      (reason) => { }
    );

  }

  /* #endregion   MsgBox */

  /* #region   header */

  onClickHeader(orderBy: string) {
    let sortOrder = '';

    if (orderBy === 'firstName') {
      this.firstNameHeader.DirectionSwitch();

      if (this.firstNameHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.firstNameHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    } else if (orderBy === 'idNumber') {
      this.numberHeader.DirectionSwitch();

      if (this.numberHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.numberHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    } else if (orderBy === 'company') {
      this.companyHeader.DirectionSwitch();

      if (this.companyHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.companyHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    } else if (orderBy === 'name') {
      this.nameHeader.DirectionSwitch();

      if (this.nameHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.nameHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    } else if (orderBy === 'status') {
      this.statusHeader.DirectionSwitch();

      if (this.statusHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.statusHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    }


    this.sort(orderBy, sortOrder);
    this.readPage();
  }

  private sort(orderBy: string, sortOrder: string) {
    this.orderBy = orderBy;
    this.sortOrder = sortOrder;
    this.setHeaderArrowToUndefined();
    this.setDirection(sortOrder, this.setPosition(orderBy)!);
    this.setHeaderArrowTemplate();
  }

  private setPosition(orderBy: string): HeaderProperties | undefined {
    if (orderBy === 'firstName') {
      return this.firstNameHeader;
    }
    if (orderBy === 'idNumber') {
      return this.numberHeader;
    }
    if (orderBy === 'company') {
      return this.companyHeader;
    }
    if (orderBy === 'name') {
      return this.nameHeader;
    }
    if (orderBy === 'status') {
      return this.statusHeader;
    }
    return undefined;
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
    this.arrowFirstName = this.setHeaderArrowTemplateSub(this.firstNameHeader);
    this.arrowCompany = this.setHeaderArrowTemplateSub(this.companyHeader);
    this.arrowNo = this.setHeaderArrowTemplateSub(this.numberHeader);
    this.arrowName = this.setHeaderArrowTemplateSub(this.nameHeader);
    this.arrowStatus = this.setHeaderArrowTemplateSub(this.statusHeader);
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
    return '';
  }

  private reReadSortData() {
    this.sort(this.orderBy, this.sortOrder);
  }

  private setHeaderArrowToUndefined() {
    this.firstNameHeader.order = HeaderDirection.None;
    this.numberHeader.order = HeaderDirection.None;
    this.companyHeader.order = HeaderDirection.None;
    this.nameHeader.order = HeaderDirection.None;
    this.statusHeader.order = HeaderDirection.None;

  }

  /* #endregion   header */

  /* #region   CheckBox */


  checkBoxValue(i: number): boolean {

    try {
      const tmpClient = this.dataManagementEmployeeService!.listWrapper!.employees[i];
      const tmpCheckBoxValue = this.dataManagementEmployeeService.findCheckBoxValue(tmpClient.id!);

      if (this.dataManagementEmployeeService.headerCheckBoxValue === true) {
        if (tmpCheckBoxValue) {
          return tmpCheckBoxValue.Checked;
        }
        return true;

      }

      if (tmpCheckBoxValue) {
        return tmpCheckBoxValue.Checked;
      }

    } finally {
      this.checkBoxIndeterminate = this.dataManagementEmployeeService.checkBoxIndeterminate();

    }
    return false;

  }

  onChangeCheckBox(i: number, value: any) {

    try {


      const isChecked = value.currentTarget.checked;
      const tmpClient = this.dataManagementEmployeeService.listWrapper!.employees[i];
      const tmpCheckBoxValue = this.dataManagementEmployeeService.findCheckBoxValue(tmpClient.id!);

      if (tmpCheckBoxValue) {
        tmpCheckBoxValue.Checked = isChecked;
      } else {
        const c = new CheckBoxValue();
        c.id = tmpClient.id!;
        c.Checked = isChecked;
        this.dataManagementEmployeeService.addCheckBoxValueToArray(c);
      }
    } finally {
      this.checkBoxIndeterminate = this.dataManagementEmployeeService.checkBoxIndeterminate();

    }


  }

  onChangeHeaderCheckBox() {
    this.dataManagementEmployeeService.clearCheckedArray();
  }

  /* #endregion   CheckBox */


}


