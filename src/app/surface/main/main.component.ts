import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  Injector,
  OnChanges,
} from '@angular/core';
import { AddressHomeComponent } from 'src/app/workplace/address/all-address/all-address-home/address-home.component';
import { AddressEditHomeComponent } from './../../workplace/address/address-edit/address-edit-home/address-edit-home.component';
import { ProfilHomeComponent } from './../../workplace/profil/profil-home/profil-home.component';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnChanges {
  @ViewChild('LazyLoadingPlaceholder', { read: ViewContainerRef, static: true })

  viewContainer: ViewContainerRef | undefined;


  @Input() isAllAddress: boolean = false;
  @Input() isEditAddress: boolean = false;
  @Input() isProfile: boolean = false;

  @Output() isChangingEvent = new EventEmitter<boolean>();
  @Output() isEnterEvent = new EventEmitter();

  compInstanceAddressHome: AddressHomeComponent | undefined;
  compInstanceAddressEditHome: AddressEditHomeComponent | undefined;
  compInstanceProfilHome: ProfilHomeComponent | undefined;;

  constructor(
    private injector: Injector,
    private cfr: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {

    /* #region   all-address */
    if (this.isAllAddress && !this.compInstanceAddressHome) {
      import('./../../workplace/address/all-address/all-address-home/address-home.component').then(m => {
        const comp = m.AddressHomeComponent;


        const factory =
          this.cfr.resolveComponentFactory(comp);

        const compRef = this.viewContainer!.createComponent(
          factory, undefined, this.injector);

        this.compInstanceAddressHome = compRef.instance;
        this.compInstanceAddressHome.isAllAddress = this.isAllAddress;

        // compRef.instance.isChangingEvent.subscribe((event:boolean) => {
        //   this.isChangingEvent.emit(event);
        // });


      });

    }

    if (this.isEditAddress && !this.compInstanceAddressEditHome) {
      import('./../../workplace/address/address-edit/address-edit-home/address-edit-home.component').then(m => {
        const comp = m.AddressEditHomeComponent;


        const factory =
          this.cfr.resolveComponentFactory(comp);

        const compRef = this.viewContainer!.createComponent(
          factory, undefined, this.injector);

        this.compInstanceAddressEditHome = compRef.instance;
        this.compInstanceAddressEditHome.isEditAddress = this.isEditAddress;

        compRef.instance.isChangingEvent.subscribe((event: boolean) => {
          this.isChangingEvent.emit(event);
        });


      });

    }

    if (this.compInstanceAddressHome) {
      (this.compInstanceAddressHome as AddressHomeComponent).isAllAddress = this.isAllAddress;
    }
    if (this.compInstanceAddressEditHome) {
      (this.compInstanceAddressEditHome as AddressEditHomeComponent).isEditAddress = this.isEditAddress;
    }

    /* #endregion   all-address */

    /* #region   profile */
    if (this.isProfile && !this.compInstanceProfilHome) {
      import('./../../workplace/profil/profil-home/profil-home.component').then(m => {
        const comp = m.ProfilHomeComponent;


        const factory =
          this.cfr.resolveComponentFactory(comp);

        const compRef = this.viewContainer!.createComponent(
          factory, undefined, this.injector);

        this.compInstanceProfilHome = compRef.instance;
        this.compInstanceProfilHome.isProfile = this.isProfile;

        compRef.instance.isChangingEvent.subscribe(event => {
          this.isChangingEvent.emit(event);
        });


      });
    }

    if (this.compInstanceProfilHome) {
      this.compInstanceProfilHome.isProfile = this.isProfile;
    }
    /* #region   profile */
  }

  onIsChanging(value: boolean) {
    this.isChangingEvent.emit(value);
  }

  onIsEnter() {
    this.isEnterEvent.emit();
  }
}
