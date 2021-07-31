import { Component, OnInit, Output, EventEmitter, Inject, Input } from '@angular/core';
import { DataManagementSettingsService } from 'src/app/data/management/data-management-settings.service';
import { DataManagementSwitchboardService } from 'src/app/data/management/data-management-switchboard.service';
import { MessageLibrary } from 'src/app/helpers/string-constants';

@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.component.html',
  styleUrls: ['./settings-home.component.scss'],
})
export class SettingsHomeComponent implements OnInit {
  @Input() isSetting: boolean =false;
  @Output() isChangingEvent = new EventEmitter();

  constructor(
    @Inject(DataManagementSwitchboardService)
    public dataManagementSwitchboardService: DataManagementSwitchboardService,
    @Inject(DataManagementSettingsService)
    public dataManagementSettingsService: DataManagementSettingsService
  ) {}

  ngOnInit(): void {
    const id =  localStorage.getItem(MessageLibrary.TOKEN_USERID) +  '';
    this.dataManagementSettingsService.CurrentAccoutId = id;
    this.dataManagementSwitchboardService.isFocused = 'DataManagementSettingsService';
    this.dataManagementSettingsService.readData();
  }

  onIsChanging(event:boolean) {
    this.isChangingEvent.emit(event);
  }

  
}
