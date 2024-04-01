import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Transaction, TransactionDetail } from './transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) {
    this.http = http;
  }

  private baseUrl = `${environment.baseUrl}/transaction`;

  getCustomerOrder(transaction: Transaction, accessToken: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<Transaction[]>(`${this.baseUrl}/getCustomerOrder`, transaction, {headers: headers});
  }

  getCateringOrder(transaction: Transaction, accessToken: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any[]>(`${this.baseUrl}/getCateringOrder`, transaction, {headers: headers});
  }

  updateTransactionStatus(transaction: Transaction, accessToken: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.put<any[]>(`${this.baseUrl}/updateStatus`, transaction, {headers: headers});
  }

  updateCustomerOrderDetail(transaction: TransactionDetail, accessToken: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.put<any[]>(`${this.baseUrl}/updateDetailOrder`, transaction, {headers: headers});
  }
}
