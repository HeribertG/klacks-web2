import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DataLoadFileService } from 'src/app/data/data-load-file.service';
import { getFileExtension } from 'src/app/helpers/format-helper';
import { MessageLibrary } from 'src/app/helpers/string-constants';

@Component({
  selector: 'app-profil-picture',
  templateUrl: './profil-picture.component.html',
  styleUrls: ['./profil-picture.component.scss']
})
export class ProfilPictureComponent implements OnInit {
  @Output() isChangingEvent = new EventEmitter();


  selectedFile: File|undefined;

  profileImage: any;

  constructor(
      public dataLoadFileService: DataLoadFileService) { }

  ngOnInit(): void {

  }

  onFileSelected(event:any) {
    this.selectedFile = event.target.files[0] as File;

    this.upload();
  }

  private upload() {

    const id = localStorage.getItem(MessageLibrary.TOKEN_USERID);

    if (id) {

      const ext = getFileExtension(this.selectedFile!.name);

      const filename = ext !== null && ext.length > 0 ? `${id}profile.` + ext : `${id}profile`;
      const fd = new FormData();
      fd.append('file', this.selectedFile!, filename);

      this.dataLoadFileService.upLoadFile(fd).subscribe(
        (event:any) => {
          this.tryLoadProfileImage();
          this.selectedFile = undefined;
        }
      );
    }
  }

  onDeleteImg() {
    const id = localStorage.getItem(MessageLibrary.TOKEN_USERID);

    if (id) {

    const type =  `${id}profile`;
    this.dataLoadFileService.deleteFile(type);
    }
  }

  onUpload(event:any) {
   
    this.selectedFile = event[0] as File;

    this.upload();
  }

  onUpload1(event:any) {
    const img = event.target.files;
    this.selectedFile = img[0] as File;

    this.upload();
  }

  private tryLoadProfileImage() {

    const id = localStorage.getItem(MessageLibrary.TOKEN_USERID);
    const imgId = `${id}profile`;
    this.dataLoadFileService.downLoadFile(imgId);
  }


}

