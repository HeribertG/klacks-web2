import { Component, OnInit, Input, AfterViewInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { HeaderProperties, HeaderDirection } from 'src/app/core/headerProperties';
import { IAddress, ICountry } from 'src/app/core/client-class';
import { AddressTypeEnum } from 'src/app/helpers/enums/client-enum';
import { MessageLibrary } from 'src/app/helpers/string-constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-address-history-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressHistoryListComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() isChangingAddress = new EventEmitter<string>();
  @Input() addressList: IAddress[];
  @Input() countries: ICountry[];

  messageReactive = MessageLibrary.REACTIVE_ADDRESS;
  titleReactive = MessageLibrary.REACTIVE_ADDRESS_TITLE;

  numberOfItemsPerPage = 5;
  private tmplateArrowDown = '↓';
  private tmplateArrowUp = '↑';
  private tmplateArrowUndefined = '↕';

  arrowValidFrom = '↑';
  arrowStreet = '';
  arrowZip = '';
  arrowCity = '';
  arrowCountry = '';

  validFromHeader: HeaderProperties = new HeaderProperties();
  streetHeader: HeaderProperties = new HeaderProperties();
  zipHeader: HeaderProperties = new HeaderProperties();
  cityHeader: HeaderProperties = new HeaderProperties();
  countryHeader: HeaderProperties = new HeaderProperties();

  orderBy = 'validFrom';
  sortOrder = 'desc';


  requiredPage = 1;
  maxItems = 0;
  sortedAddressList = new Array<IAddress>();
  tmpAdress: IAddress;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.reReadSortData();
    this.readPage();

  }


  ngOnChanges(changes) {
    this.readPage();
  }


  onPageChange() {
    setTimeout(() => this.readPage(), 100);
  }

  onClickHeader(orderBy: string) {
    let sortOrder = '';

    if (orderBy === 'zip') {
      this.zipHeader.DirectionSwitch();

      if (this.zipHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.zipHeader.order === HeaderDirection.Up) {
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
    } else if (orderBy === 'street') {
      this.streetHeader.DirectionSwitch();

      if (this.streetHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.streetHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    } else if (orderBy === 'city') {
      this.cityHeader.DirectionSwitch();

      if (this.cityHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.cityHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    } else if (orderBy === 'country') {
      this.countryHeader.DirectionSwitch();

      if (this.countryHeader.order === HeaderDirection.Down) {
        sortOrder = 'asc';
      } else if (this.countryHeader.order === HeaderDirection.Up) {
        sortOrder = 'desc';
      } else {
        sortOrder = '';
      }
    }


    this.sort(orderBy, sortOrder);

  }

  private sort(orderBy: string, sortOrder: string) {
    this.orderBy = orderBy;
    this.sortOrder = sortOrder;
    this.setHeaderArrowToUndefined();
    this.setDirection(sortOrder, this.setPosition(orderBy));
    this.setHeaderArrowTemplate();

    this.readPage();
  }

  private setPosition(orderBy: string): HeaderProperties {
    if (orderBy === 'zip') {
      return this.zipHeader;
    }
    if (orderBy === 'validFrom') {
      return this.validFromHeader;
    }
    if (orderBy === 'street') {
      return this.streetHeader;
    }
    if (orderBy === 'city') {
      return this.cityHeader;
    }
    if (orderBy === 'country') {
      return this.countryHeader;
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
    this.arrowZip = this.setHeaderArrowTemplateSub(this.zipHeader);
    this.arrowStreet = this.setHeaderArrowTemplateSub(this.streetHeader);
    this.arrowValidFrom = this.setHeaderArrowTemplateSub(this.validFromHeader);
    this.arrowCity = this.setHeaderArrowTemplateSub(this.cityHeader);
    this.arrowCountry = this.setHeaderArrowTemplateSub(this.countryHeader);
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
    this.sort(this.orderBy, this.sortOrder);
  }

  private setHeaderArrowToUndefined() {
    this.zipHeader.order = HeaderDirection.None;
    this.validFromHeader.order = HeaderDirection.None;
    this.streetHeader.order = HeaderDirection.None;
    this.cityHeader.order = HeaderDirection.None;
    this.countryHeader.order = HeaderDirection.None;

  }

  setCountry(id: string): string {
    const c = this.countries.find(x => x.abbreviation === id);
    if (c) { return c.name; }
    return id;
  }

  setType(index: AddressTypeEnum): string {
    switch (index) {
      case AddressTypeEnum.customer:
        return MessageLibrary.ADDRES_TYPE0_NAME;
      case AddressTypeEnum.invoicingAddress:
        return MessageLibrary.ADDRES_TYPE2_NAME;
      case AddressTypeEnum.workplace:
        return MessageLibrary.ADDRES_TYPE1_NAME;
    }
  }


  readPage() {
    if (!this.addressList) {
      this.requiredPage = 1;
      this.sortedAddressList = undefined;
      return;
    }

    if (this.addressList.length === 0) {
      this.requiredPage = 1;
      this.sortedAddressList = undefined;
      return;
    }


    if (!this.addressList[0].id) {
      this.requiredPage = 1;
      this.sortedAddressList = undefined;
      return;
    }

    this.maxItems = this.addressList.length;
    try {

      const that = this;
      this.sortedAddressList = this.addressList.sort(
        function compare(
          a: IAddress,
          b: IAddress
        ) {
          switch (that.orderBy) {

            case 'validFrom':
              const tmpA = new Date(a.validFrom);
              const tmpB = new Date(b.validFrom);

              return subCompare(tmpA, tmpB);

            case 'street':
              if (that.sortOrder === 'asc') {
                return a.street.localeCompare(b.street);
              } else {
                return b.street.localeCompare(a.street);
              }
              break;


            case 'zip':
              if (that.sortOrder === 'asc') {
                return a.zip.localeCompare(b.zip);
              } else {
                return b.zip.localeCompare(a.zip);
              }
              break;
            case 'city':
              if (that.sortOrder === 'asc') {
                return a.city.localeCompare(b.city);
              } else {
                return b.city.localeCompare(a.city);
              }
              break;

          }

          function subCompare(tmpA: Date, tmpB: Date): number {
            if (that.sortOrder === 'asc') {
              if (tmpA < tmpB) {
                return -1;
              } else if (tmpA === tmpB) {
                return 0;
              } else {
                return 1;
              }
            } else {
              if (tmpA < tmpB) {
                return 1;
              } else if (tmpA === tmpB) {
                return 0;
              } else {
                return -1;
              }
            }
          }

        });


      if (this.addressList.length > 0) {
        const currPage = this.requiredPage - 1 < 0 ? 0 : this.requiredPage - 1;
        const startItem = currPage * this.numberOfItemsPerPage;
        const endItem = startItem + this.numberOfItemsPerPage;
        this.sortedAddressList = this.addressList.slice(startItem, endItem);

      }

    } catch (e) {
      console.log(e);
    }



  }


  onClickRestore(content, event: IAddress) {

    this.modalService.open(content, { size: 'sm', centered: true }).result.then(
      () => {

        this.isChangingAddress.emit(event.id);
        event.isDeleted = false;

      },
      () => { }
    );
  }
}
