import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Food } from './food.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) {
    this.http = http;
  }

  private baseUrl = `${environment.baseUrl}/food`;


  findFood(food: any, accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<Food[]>(`${this.baseUrl}/findFood`, food, {headers: headers});
  }

  addFood(food: Food, accessToken: any): Observable<Food>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<Food>(`${this.baseUrl}/add`, food, {headers: headers});
  }

  updateFood(food: Food, accessToken: any): Observable<Food>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.put<Food>(`${this.baseUrl}/update`, food, {headers: headers});
  }

  deleteFood(food_id: string, accessToken: any): Observable<void>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.delete<void>(`${this.baseUrl}/delete/${food_id}`, {headers: headers});
  }
}
