import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataManagementSettingsService } from 'src/app/data/management/data-management-settings.service';
import { Country } from 'src/app/core/employee-class';
import { CreateEntriesEnum } from 'src/app/helpers/enums/client-enum';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {
  @Output() isChangingEvent = new EventEmitter<boolean>();


  constructor(public dataManagementSettingsService: DataManagementSettingsService) {}

  ngOnInit(): void {

  }

  onClickAdd() {
    const c = new Country();
    c.isDirty =  CreateEntriesEnum.new;
    this.dataManagementSettingsService.countriesList.push(c);
    this.onIsChanging(true);
  }

  onClickDelete(index: number) {

    const c =  this.dataManagementSettingsService.countriesList[index];

    if (c) {
      if (c.isDirty && c.isDirty === CreateEntriesEnum.new) {
        this.dataManagementSettingsService.countriesList.splice(index, 1);
      } else {
        c.name = c.name + '--isDeleted';
        c.isDirty = CreateEntriesEnum.delete;
      }
    }

    this.onIsChanging(true);

  }



  onIsChanging(value:boolean) {
    this.isChangingEvent.emit(value);
  }

}
