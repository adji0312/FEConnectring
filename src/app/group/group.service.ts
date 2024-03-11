import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Group } from './group.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {
    this.http = http;
  }

  private baseUrl = `${environment.baseUrl}/group`;

  getAllGroup(accessToken: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.get<Group>(`${this.baseUrl}/all`, {headers: headers});
  }

  addGroup(group: Group, accessToken: any): Observable<Group>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.post<Group>(`${this.baseUrl}/add`, group, {headers: headers});
  }

  findGroupByOwner(owner: string, accessToken: any): Observable<Group>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    return this.http.get<Group>(`${this.baseUrl}/getGroupByOwner/${owner}`, {headers:headers});
  }
}
