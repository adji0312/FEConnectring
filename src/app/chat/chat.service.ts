import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Chat } from './chat.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private router: Router, private http: HttpClient) {
    this.http = http;
  }

  private baseUrl = `${environment.baseUrl}/chat`;

  addChat(chat: Chat, accessToken: any): Observable<Chat>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<Chat>(`${this.baseUrl}/add`, chat, {headers: headers});
  }
}
