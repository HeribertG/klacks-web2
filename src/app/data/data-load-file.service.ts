import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { retry } from 'rxjs/operators';
import * as  FileSaver from 'file-saver';

import { Observable, Subscription } from 'rxjs';
import { IImage } from '../core/general-class';

@Injectable({
  providedIn: 'root'
})
export class DataLoadFileService {

  profileImage: any;
  iconImage: any;
  logoImage: any;

  constructor(
    private httpClient: HttpClient) { }

  upLoadFile(file: FormData) {

    return this.httpClient
      .post(
        `${environment.baseUrl}LoadFile/Upload/`,
        file
      ).pipe();

  }

  downLoadFile(type: string) {

    return this.httpClient
      .get(
        `${environment.baseUrl}LoadFile/DownLoad?type=` + type, { responseType: 'blob' })
      .pipe(retry(3))
      .subscribe(data => {
        this.createImageFromBlob(data);
      }, error => {
        console.log(error);
      });
  }

  downLoadIcon() {

    return this.httpClient
      .get(
        `${environment.baseUrl}LoadFile/DownLoad?type=` + 'own-icon.ico', { responseType: 'blob' })
      .pipe(retry(3))
      .subscribe(data => {
        this.createIconFromBlob(data);

      }, error => {
        console.log(error);
      });
  }

  downLoadLogo() {

    return this.httpClient
      .get(
        `${environment.baseUrl}LoadFile/DownLoad?type=` + 'own-logo.png', { responseType: 'blob' })
      .pipe(retry(3))
      .subscribe(data => {
        this.createLogoFromBlob(data);

      }, error => {
        console.log(error);
      });
  }

  deleteIcon() {

    return this.httpClient
      .delete(
        `${environment.baseUrl}LoadFile/` + 'own-icon.ico')
      .pipe().subscribe(x => { this.profileImage = undefined; });

  }

  deleteLogo() {

    return this.httpClient
      .delete(
        `${environment.baseUrl}LoadFile/` + 'own-logo.png')
      .pipe().subscribe(x => { this.profileImage = undefined; });

  }

  deleteFile(type: string) {

    return this.httpClient
      .delete(
        `${environment.baseUrl}LoadFile/` + type)
      .pipe().subscribe(x => { this.profileImage = undefined; });

  }

 

  private createImageFromBlob(image: Blob) {

    if (image.type === 'text/plain') {
      this.profileImage = undefined;
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.profileImage = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  private createIconFromBlob(image: Blob) {

    if (image.type === 'text/plain') {
      this.iconImage = undefined;
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.iconImage = reader.result;


      const favicon = document.getElementById('appIcon') as HTMLLinkElement;
      favicon.href = reader!.result!.toString();
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  private createLogoFromBlob(image: Blob) {

    if (image.type === 'text/plain') {
      this.logoImage = undefined;
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.logoImage = reader.result;

    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  /* #region   standart Image */

  addImage(value: IImage): Observable<IImage> {
    
    return this.httpClient
      .post<IImage>(
        `${environment.baseUrl}LoadFile/Image/`,
        value
      )
      .pipe(retry(3));
  }

  updateImage(value: IImage): Observable<IImage> {
      return this.httpClient
      .put<IImage>(
        `${environment.baseUrl}LoadFile/Image/`,
        value
      )
      .pipe(retry(3));
  }

  deleteImage(id: string): Observable<IImage> {
    return this.httpClient
      .delete<IImage>(
        `${environment.baseUrl}LoadFile/DeleteImage/` + id
      )
      .pipe(retry(3));

  }

  downloadImage(key: string, fileName: string): Subscription {
    return this.httpClient.get(
      `${environment.baseUrl}LoadFile/DownLoadImage/` + key, { responseType: 'blob' }).pipe()
      // tslint:disable-next-line: deprecation
      .subscribe(response => FileSaver.saveAs(response, fileName));
  }

  downLoadImage(id: string) {

    return this.httpClient
      .get(
        `${environment.baseUrl}LoadFile/GetSimpleImage?guid=${id}`, { responseType: 'blob' });


  }


  /* #endregion   standart Image */

}
