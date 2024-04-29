import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdminChat } from './list-chat/admin-chat.model';

@Injectable({
  providedIn: 'root'
})
export class AdminChatService {

  constructor(private http: HttpClient) {
    this.http = http;
  }
  
  private baseUrl = `${environment.baseUrl}/adminChat`;

  getAllAdminChat(accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.get(`${this.baseUrl}/all`, {headers: headers});
  }

  addAdminChat(chat: AdminChat, accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<any>(`${this.baseUrl}/add`, chat, {headers: headers});
  }
}
