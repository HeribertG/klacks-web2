import { Component, OnInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { DataLoadFileService } from 'src/app/data/data-load-file.service';
import { DataManagementSettingsService } from 'src/app/data/management/data-management-settings.service';


@Component({
  selector: 'app-setting-general',
  templateUrl: './setting-general.component.html',
  styleUrls: ['./setting-general.component.scss']
})
export class SettingGeneralComponent implements OnInit {
  @Output() isChangingEvent = new EventEmitter<boolean>();
 
  selectedFileIcon: File| undefined;
  selectedFileLogo: File| undefined;
  isChecked = false;

  constructor(
    public dataLoadFileService: DataLoadFileService,
    public dataManagementSettingsService: DataManagementSettingsService
  ) { }

  ngOnInit(): void {
    this.setTheme();
  }

  onChange() {
    this.isChangingEvent.emit(true);
  }

  onKeyUp() {
    this.isChangingEvent.emit(true);
  }

  onIconSelected(event:any) {
    this.selectedFileIcon = event.target.files[0] as File;
    this.uploadIcon();
  }

  private uploadIcon() {

    if (this.selectedFileIcon!.name) {

      const fd = new FormData();

      fd.append('file', this.selectedFileIcon!, 'own-icon.ico');

      this.dataLoadFileService.upLoadFile(fd).subscribe(
        event => {
          this.tryLoadProfileImage();
          this.selectedFileIcon = undefined;
        }
      );
    }

  }

 
  onUploadIcon(event:any) {
    this.selectedFileIcon = event[0] as File;
    this.uploadIcon();
  }

  onUploadIcon1(event:any) {
    const tmp = event.target.files;
    this.selectedFileIcon = tmp[0] as File;
    this.uploadIcon();
  }

  onLogoSelected(event:any) {
    this.selectedFileLogo = event.target.files[0] as File;
    this.uploadLogo();
  }

  uploadLogo() {

    const fd = new FormData();
    fd.append('file', this.selectedFileLogo!, 'own-logo.png');

    this.dataLoadFileService.upLoadFile(fd).subscribe(
      event => {
        this.tryLoadProfileImage();
        this.selectedFileLogo = undefined;
      }
    );

  }

  onUploadLogo(event:any) {
    this.selectedFileLogo = event[0] as File;
    this.uploadLogo();
  }

  onUploadLogo1(event:any) {
    const tmp = event.target.files;
    this.selectedFileLogo = tmp[0] as File;
    this.uploadLogo();
  }

  private tryLoadProfileImage() {

    this.dataLoadFileService.downLoadIcon();
    this.dataLoadFileService.downLoadLogo();
  }

  onClickDeleteIcon() {
    this.dataLoadFileService.iconImage = undefined;
    this.dataLoadFileService.deleteFile('own-icon.ico');
    const favicon = document.getElementById('appIcon') as HTMLLinkElement;
    favicon.href = 'favicon.ico';
  }

  onClickDeleteLogo() {
    this.dataLoadFileService.logoImage = undefined;
    this.dataLoadFileService.deleteFile('own-logo.png');
  }

  onDarkmodeChecked() {
    if (this.isChecked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  setTheme() {

    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    if (currentTheme === 'dark') {
      this.isChecked = true;

    }
  }
}
