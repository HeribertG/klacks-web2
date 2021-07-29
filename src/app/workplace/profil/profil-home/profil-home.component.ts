import { Component, OnInit, Output, EventEmitter, Inject, Input } from '@angular/core';
import { DataManagementProfileService } from 'src/app/data/management/data-management-profile.service';
import { DataManagementSwitchboardService } from 'src/app/data/management/data-management-switchboard.service';

@Component({
  selector: 'app-profil-home',
  templateUrl: './profil-home.component.html',
  styleUrls: ['./profil-home.component.scss']
})
export class ProfilHomeComponent implements OnInit {

  @Output() isChangingEvent = new EventEmitter();
  @Input() isProfile: boolean= false;


  constructor(
    @Inject(DataManagementSwitchboardService)
    public dataManagementSwitchboardService: DataManagementSwitchboardService,
    @Inject(DataManagementProfileService)
    public dataManagementProfileService: DataManagementProfileService
  ) { }

  ngOnInit(): void {
    this.dataManagementSwitchboardService.isFocused = 'DataManagementProfileService';
    this.dataManagementProfileService.init();
    this.dataManagementProfileService.readOptions();
    this.dataManagementProfileService.readData();

  }


  onIsChanging(event:any) {
    this.isChangingEvent.emit(event);
  }
}
