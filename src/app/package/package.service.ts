import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Food } from './food.model';
import { Observable } from 'rxjs';
import { Package } from './package.model';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  public package_header!: string;

  constructor(private http: HttpClient) {
    this.http = http;
  }

  private baseUrl = `${environment.baseUrl}/package`;

  getPackageByMerchant(pack: any, accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any>(`${this.baseUrl}/getByMerchant`, pack, {headers: headers});
  }

  addPackage(pack: Package, accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any>(`${this.baseUrl}/add`, pack, {headers: headers});
  }

  getPackageByPackageHeader(pack: Package, accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any>(`${this.baseUrl}/getByPackageHeader`, pack, {headers: headers});
  }

  updatePackage(pack: Package, accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.put<any>(`${this.baseUrl}/update`, pack, {headers: headers});
  }
}
