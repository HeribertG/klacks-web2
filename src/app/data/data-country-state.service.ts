import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ICountry, IPostCodeCH } from '../core/employee-class';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataCountryStateService {

  constructor(private httpClient: HttpClient) { }

  getCountryList() {
    return this.httpClient.get<ICountry[]>(
      `${environment.baseUrl}Countries/`).pipe();
  }

  getCountry(id: string) {
    return this.httpClient
      .get<ICountry>(
        `${environment.baseUrl}Countries/` + id
      )
      .pipe(retry(3));
  }

  updateCountry(
    value: ICountry
  ) {
    return this.httpClient
      .put<ICountry>(
        `${environment.baseUrl}Countries/`,
        value
      )
      .pipe(retry(3));
  }

  addCountry(
    value: ICountry
  ) {
    
    return this.httpClient
      .post<ICountry>(
        `${environment.baseUrl}Countries/`,
        value
      )
      .pipe(retry(3));
  }

  deleteCountry(id: string) {
    return this.httpClient
      .delete<ICountry>(
        `${environment.baseUrl}Countries/` + id
      )
      .pipe(retry(3));

  }

  getState() {
    return [
      ' ', // None
      'AG', // Kanton Aargau
      'AI', // Kanton Appenzell Innerrhoden
      'AR', // Kanton Appenzell Ausserrhoden
      'BE', // Kanton Bern
      'BL', // Kanton Basel-Landschaft
      'BS', // Kanton Basel-Stadt
      'FR', // Staat Freiburg
      'GE', // Kanton Genf
      'GL', // Kanton Glarus
      'GR', // Kanton Graubünden
      'JU', // Kanton Jura
      'LU', // Kanton Luzern
      'NE', // Kanton Neuenburg
      'NW', // Kanton Nidwalden
      'OW', // Kanton Obwalden
      'SG', // Kanton St. Gallen
      'SH', // Kanton Schaffhausen
      'SO', // Kanton Solothurn
      'SZ', // Kanton Schwyz
      'TG', // Kanton Thurgau
      'TI', // Kanton Tessin
      'UR', // Kanton Uri
      'VD', // Kanton Waadt
      'VS', // Staat Wallis
      'ZG', // Kanton Zug
      'ZH', // Kanton Zürich
    ];
  }

  SearchCity(zip: string): Promise<IPostCodeCH[]> {

    return this.httpClient.get<IPostCodeCH[]>(`${environment.baseUrl}PostcodeCh/` + zip).toPromise();

  }
}
