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

   getAllMerchantRequest(accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.get(`${this.baseUrl}/allMerchantRequest`, {headers: headers});
  }

  getRandomMerchant(accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.get(`${this.baseUrl}/random`, {headers: headers});
  }

  updateMerchant(merchant: FormData, accessToken: any):Observable<any>{
    // console.log(merchant);

    const headers = new HttpHeaders({'Authorization' : 'Bearer ' + accessToken});
    return this.http.put(`${this.baseUrl}/update`, merchant, {headers: headers});
  }

  rejectMerchant(username: string, accessToken: any): Observable<Merchant>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    // console.log(username);

    return this.http.post<Merchant>(`${this.baseUrl}/reject`, username, {headers: headers});
  }

  getMerchant(username: string, accessToken: any): Observable<any>{
    const body = {username};

    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post(`${this.baseUrl}/getMerchant`, body, {headers: headers});
  }

  getCityMerchant(accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.get(`${this.baseUrl}/findCityMerchant`, {headers: headers});
  }

  acceptMerchant(merchant: Merchant, accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any>(`${this.baseUrl}/acceptMerchant`, merchant, {headers: headers});
  }

  deleteMerchant(merchant: Merchant, accessToken: any): Observable<any>{
    // console.log(merchant);

    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any>(`${this.baseUrl}/deleteMerchant`, merchant, {headers: headers});
  }

  findMerchantWithoutToken(merchant: Merchant): Observable<any>{
    // console.log(merchant);
    // console.log(accessToken);

    const headers = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    return this.http.post(`${this.baseUrl}/findMerchantWithoutToken`, merchant, {headers:headers});
  }
}
