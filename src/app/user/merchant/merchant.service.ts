import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Merchant } from './merchant.model';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  viewCatering: Merchant = new Merchant;

  constructor(private http: HttpClient) {
    this.http = http;
   }

   private baseUrl = `${environment.baseUrl}/merchant`;

   getAllMerchant(accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.get(`${this.baseUrl}/all`, {headers: headers});
  }

  updateMerchant(merchant: Merchant, id: number,  accessToken: any):Observable<Merchant>{
    const headers = new HttpHeaders({'Authorization' : 'Bearer ' + accessToken});
    return this.http.put<Merchant>(`${this.baseUrl}/update/${id}`, merchant, {headers: headers});
  }

  deleteMerchant(username: string, accessToken: any): Observable<Merchant>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    console.log(username);
    
    return this.http.post<Merchant>(`${this.baseUrl}/delete`, username, {headers: headers});
  }
}
