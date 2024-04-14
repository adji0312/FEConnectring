import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Transaction, TransactionDetail } from './transaction.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) {
    this.http = http;
  }

  private baseUrl = `${environment.baseUrl}/transaction`;

  createTransaction(transaction: Transaction, accessToken: any):Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any>(`${this.baseUrl}/create`, transaction, {headers: headers});
  }

  getCustomerOrder(transaction: Transaction, accessToken: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<Transaction[]>(`${this.baseUrl}/getCustomerOrder`, transaction, {headers: headers});
  }

  getCustomerOrderByTransaction(transaction: Transaction, accessToken: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<Transaction[]>(`${this.baseUrl}/getCustomerOrderByTransaction`, transaction, {headers: headers});
  }

  getCateringOrder(transaction: Transaction, accessToken: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any[]>(`${this.baseUrl}/getCateringOrder`, transaction, {headers: headers});
  }

  getCateringInvoice(transaction: Transaction, accessToken: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any[]>(`${this.baseUrl}/getCateringInvoice`, transaction, {headers: headers});
  }

  getCustomerInvoice(transaction: Transaction, accessToken: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any[]>(`${this.baseUrl}/getCustomerInvoice`, transaction, {headers: headers});
  }

  getCateringOrderDetail(transaction: Transaction, accessToken: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any[]>(`${this.baseUrl}/getCateringOrderDetail`, transaction, {headers: headers});
  }

  updateTransactionStatus(transaction: Transaction, accessToken: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.put<any[]>(`${this.baseUrl}/updateStatus`, transaction, {headers: headers});
  }

  updateCustomerOrderDetail(transaction: TransactionDetail, accessToken: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.put<any[]>(`${this.baseUrl}/updateDetailOrder`, transaction, {headers: headers});
  }

  updateOrderCheck(transaction: TransactionDetail, accessToken: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.put<any[]>(`${this.baseUrl}/updateCheck`, transaction, {headers: headers});
  }

  uploadPaymentImage(formData: FormData, accessToken: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.put<any>(`${this.baseUrl}/uploadPaymentImg`, formData, {headers: headers});
  }

  acceptPayment(transaction: Transaction, accessToken: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.put<any>(`${this.baseUrl}/acceptPayment`, transaction, {headers: headers});
  }
}
