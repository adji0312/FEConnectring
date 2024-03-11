import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Food } from './food.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor(private http: HttpClient) {
    this.http = http;
  }

  private baseUrl = `${environment.baseUrl}/food`;

  addFood(food: Food, accessToken: any):Observable<Food>{
    const headers = new HttpHeaders({'Authorization' : 'Bearer ' + accessToken});
    return this.http.post<Food>(`${this.baseUrl}/add/`, food, {headers: headers});
  }
}
