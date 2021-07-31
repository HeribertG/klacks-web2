import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { ICountry } from 'src/app/core/employee-class';
import { CreateEntriesEnum } from 'src/app/helpers/enums/client-enum';

@Component({
  selector: 'app-countries-row',
  templateUrl: './countries-row.component.html',
  styleUrls: ['./countries-row.component.scss']
})
export class CountriesRowComponent implements OnInit {
  @Input() data: ICountry|undefined;

  @Output() isChangingEvent = new EventEmitter<true>();
  @Output() isDeleteEvent = new EventEmitter();

  constructor(private zone: NgZone) {}

  ngOnInit(): void {}

  onClickDelete() {
    this.isDeleteEvent.emit();
  }

  onChange(event:any) {

      this.zone.run(() => {


        if (this.data!.isDirty === undefined || this.data!.isDirty === CreateEntriesEnum.undefined) {

          this.data!.isDirty = CreateEntriesEnum.rewrite;

        }

        this.isChangingEvent.emit(true);
      });


  }

  onKeyUp(event:any) {

      this.zone.run(() => {

        if (this.data!.isDirty === undefined || this.data!.isDirty === CreateEntriesEnum.undefined) {

          this.data!.isDirty = CreateEntriesEnum.rewrite;

        }

        this.isChangingEvent.emit(true);
      });

  }
}
