import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) {
    this.http = http;
  }

  private baseUrl = `${environment.baseUrl}/customer`;

  findCustomerByUsername(username: string, accessToken: any): Observable<Customer>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.get<Customer>(`${this.baseUrl}/findCustomerByUsername/${username}`, {headers:headers});
  }

  updateCustomerGroupID(customer: Customer, accessToken: any): Observable<Customer>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    console.log(headers);
    console.log(customer);
    console.log(accessToken);
    
    return this.http.put<Customer>(`${this.baseUrl}/updateGroupID`, customer, {headers: headers});
  };

  joinGroup(customer: Customer, accessToken: any): Observable<Customer>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<Customer>(`${this.baseUrl}/joinGroup`, customer, {headers:headers});
  };
}
