import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterHistory, IHistory } from 'src/app/core/employee-class';
import { HeaderDirection, HeaderProperties } from 'src/app/core/headerProperties';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @Output() isChanged = new EventEmitter();
  @Input() historyList: IHistory[]=[];
  @Input() filterHistory: FilterHistory|undefined;

  requiredPage = 1;
  private tmplateArrowDown = '↓';
  private tmplateArrowUp = '↑';
  private tmplateArrowUndefined = '↕';

  arrowValidFrom = '';
  arrowData = '';
  arrowCurrentUserCreated = '';
  arrowOldData = '';
  arrowNewData = '';

  validFromHeader: HeaderProperties = new HeaderProperties();
  dataHeader: HeaderProperties = new HeaderProperties();
  currentUserCreatedHeader: HeaderProperties = new HeaderProperties();
  oldDataHeader: HeaderProperties = new HeaderProperties();
  newDataHeader: HeaderProperties = new HeaderProperties();

  // orderBy = 'name';
  // sortOrder = 'asc';
  constructor() { }

  ngOnInit(): void {
  }

  onPageChange() {
    setTimeout(() => this.isChanged.emit(), 100);

  }

  onClickHeader(orderBy: string) {
    let sortOrder = '';

    if (orderBy === 'currentUserCreated') {
      this.currentUserCreatedHeader.DirectionSwitch();

      if (this.currentUserCreatedHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.currentUserCreatedHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    } else if (orderBy === 'validFrom') {
      this.validFromHeader.DirectionSwitch();

      if (this.validFromHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.validFromHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    } else if (orderBy === 'data') {
      this.dataHeader.DirectionSwitch();

      if (this.dataHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.dataHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    } else if (orderBy === 'oldData') {
      this.oldDataHeader.DirectionSwitch();

      if (this.oldDataHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.oldDataHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    } else if (orderBy === 'newData') {
      this.newDataHeader.DirectionSwitch();

      if (this.newDataHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.newDataHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    }


    this.sort(orderBy, sortOrder);
    this.isChanged.emit();
  }

  private sort(orderBy: string, sortOrder: string) {
    this.filterHistory!.orderBy = orderBy;
    this.filterHistory!.sortOrder = sortOrder;
    this.setHeaderArrowToUndefined();
    this.setDirection(sortOrder, this.setPosition(orderBy)!);
    this.setHeaderArrowTemplate();
  }

  private setPosition(orderBy: string): HeaderProperties| undefined {
    if (orderBy === 'currentUserCreated') {
      return this.currentUserCreatedHeader;
    }
    if (orderBy === 'validFrom') {
      return this.validFromHeader;
    }
    if (orderBy === 'data') {
      return this.dataHeader;
    }
    if (orderBy === 'oldData') {
      return this.oldDataHeader;
    }
    if (orderBy === 'newData') {
      return this.newDataHeader;
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
    this.arrowCurrentUserCreated = this.setHeaderArrowTemplateSub(this.currentUserCreatedHeader);
    this.arrowData = this.setHeaderArrowTemplateSub(this.dataHeader);
    this.arrowValidFrom = this.setHeaderArrowTemplateSub(this.validFromHeader);
    this.arrowOldData = this.setHeaderArrowTemplateSub(this.oldDataHeader);
    this.arrowNewData = this.setHeaderArrowTemplateSub(this.newDataHeader);
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
    return ''
  }

  private reReadSortData() {
    this.sort(this.filterHistory!.orderBy, this.filterHistory!.sortOrder);
  }

  private setHeaderArrowToUndefined() {
    this.currentUserCreatedHeader.order = HeaderDirection.None;
    this.validFromHeader.order = HeaderDirection.None;
    this.dataHeader.order = HeaderDirection.None;
    this.oldDataHeader.order = HeaderDirection.None;
    this.newDataHeader.order = HeaderDirection.None;

  }


}
