import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from 'src/app/chat/chat.model';
import { environment } from 'src/environments/environment';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customer: Customer = new Customer;

  constructor(private http: HttpClient) {
    this.http = http;
  }

  private baseUrl = `${environment.baseUrl}/customer`;

  findCustomerByUsername(username: string, accessToken: any): Observable<any>{
    // console.log(username);
    // console.log(accessToken);

    const body = {username};
    
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post(`${this.baseUrl}/findCustomerByUsername`, body, {headers:headers});
  }

  joinGroup(customer: Customer, accessToken: any): Observable<Customer>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<Customer>(`${this.baseUrl}/joinGroup`, customer, {headers:headers});
  }

  leaveGroup(customer: Customer, accessToken: any): Observable<Customer>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<Customer>(`${this.baseUrl}/leaveGroup`, customer, {headers:headers});
  }

  getAllCustomer(accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.get(`${this.baseUrl}/all`, {headers:headers});
  }

  updateCustomer(customer: FormData, accessToken: any):Observable<any>{
    const headers = new HttpHeaders({'Authorization' : 'Bearer ' + accessToken});
    return this.http.put(`${this.baseUrl}/update`, customer, {headers: headers});
  }

  deleteCustomer(username: string, accessToken: any): Observable<void>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.delete<void>(`${this.baseUrl}/delete/${username}`, {headers: headers});
  }
}
