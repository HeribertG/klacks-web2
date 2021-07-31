import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  EventEmitter,
  Output,
  OnDestroy,
  DoCheck
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataManagementSettingsService } from 'src/app/data/management/data-management-settings.service';

@Component({
  selector: 'app-setting-owner-address',
  templateUrl: './setting-owner-address.component.html',
  styleUrls: ['./setting-owner-address.component.scss']
})
export class SettingOwnerAddressComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  @Output() isChangingEvent = new EventEmitter();

  @ViewChild(NgForm, { static: false }) ownerAddressForm: NgForm|undefined;

  keyValueDiffers: any;
  objectForUnsubscribe: any;


  constructor(public dataManagementSettingsService: DataManagementSettingsService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {


    this.objectForUnsubscribe = this.ownerAddressForm!.valueChanges!.subscribe(() => {

      if (this.ownerAddressForm!.dirty) {
        setTimeout(() => this.isChangingEvent.emit(true), 100);

      }

    });


    this.dataManagementSettingsService.isReset.subscribe(x => {
      setTimeout(() => this.isChangingEvent.emit(false), 100);
    });

  }

  ngDoCheck() {
    // this.objectForUnsubscribe = this.ownerAddressForm.valueChanges.subscribe((x) => {

    //   if (this.ownerAddressForm.dirty) {
    //     setTimeout(() => this.isChangingEvent.emit(true), 100);

    //   }

    // });
  }


  ngOnDestroy(): void {
    this.objectForUnsubscribe.unsubscribe();
  }
}
