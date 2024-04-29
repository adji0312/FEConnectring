import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Chat } from './chat.model';
import { Observable } from 'rxjs';
import { ChatMessage } from './chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public chat!: Chat;
  viewChat: Chat = new Chat;

  constructor(private router: Router, private http: HttpClient) {
    this.http = http;
  }

  private baseUrl = `${environment.baseUrl}/chat`;

  addChat(chat: Chat, accessToken: any): Observable<Chat>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<Chat>(`${this.baseUrl}/add`, chat, {headers: headers});
  }

  // findChat(chat: Chat, accessToken: any): Observable<any>{
  //   const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
  //   return this.http.get(`${this.baseUrl}/findChat`, chat, {headers: headers});
  // }

  findChat(chat: Chat, accessToken: any): Observable<any>{
    // console.log(chat);

    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any>(`${this.baseUrl}/findChat`, chat, {headers:headers});
  }

  getCustomerChat(chat: Chat, accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any>(`${this.baseUrl}/getCustomerChat`, chat, {headers:headers});
  }

  getMerchantChat(chat: Chat, accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any>(`${this.baseUrl}/getMerchantChat`, chat, {headers:headers});
  }

  getMessage(chat: Chat, accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any>(`${this.baseUrl}/getMessage`, chat, {headers:headers});
  }

  addMessage(chat: Chat, accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any>(`${this.baseUrl}/addMessage`, chat, {headers:headers});
  }

  addAdminChatCustomer(chat: Chat, accessToken: any): Observable<Chat>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<Chat>(`${this.baseUrl}/addAdminChatCustomer`, chat, {headers: headers});
  }

  addAdminChatMerchant(chat: Chat, accessToken: any): Observable<Chat>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<Chat>(`${this.baseUrl}/addAdminChatMerchant`, chat, {headers: headers});
  }

  findChatAdminCustomer(chat: Chat, accessToken: any): Observable<any>{
    // console.log(chat);
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any>(`${this.baseUrl}/findAdminChatCustomer`, chat, {headers:headers});
  }

  findChatAdminMerchant(chat: Chat, accessToken: any): Observable<any>{
    // console.log(chat);
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any>(`${this.baseUrl}/findAdminChatMerchant`, chat, {headers:headers});
  }

  addMessageAdmin(chat: Chat, accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any>(`${this.baseUrl}/addMessageAdmin`, chat, {headers:headers});
  }

  getAdminChat(accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.get<any>(`${this.baseUrl}/allAdminChat`, {headers:headers});

  }

  sendMessage(accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.get<any>(`https://api.whatsapp.com/send?phone=0895394620186&text=I'm%20interested%20in%20your%20car%20for%20sale`, {headers:headers});

  }
}
