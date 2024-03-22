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

  constructor(private http: HttpClient) {
    this.http = http;
  }

  private baseUrl = `${environment.baseUrl}/package`;

  addPackage(pack: Package, accessToken: any): Observable<Package>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<Package>(`${this.baseUrl}/add`, pack, {headers: headers});
  }
}
