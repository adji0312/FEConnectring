import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private subject = new Subject<any>();
  private token: any;

  constructor(private router: Router, private http: HttpClient) {
    this.http = http;
  }

  private baseUrl = `${environment.baseUrl}/auth`;

  isLoggedIn(){
    if(localStorage.getItem('currentUser')){
      this.subject.next({status:true});
    }else{
      this.subject.next({status: false});
    }
  }

  clearStatus(){
    this.subject.next;
  }

  getStatus(): Observable<any>{
    return this.subject.asObservable();
  }
  
  logout(){
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  public regisUser(user: any): Observable<any>{
    const headers = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    return this.http.post(environment.baseUrl+"/auth/register-customer", user, {headers: headers});
  }

  // public regisMerchant(user: any): Observable<any>{
  //   const headers = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
  //   return this.http.post(environment.baseUrl+"/auth/register-merchant", user, {headers: headers});
  // }
  
  regisMerchant(user: User, accessToken: any): Observable<User> {
    const headers = new HttpHeaders({'Authorization' : 'Bearer ' + accessToken});
    return this.http.post<User>(environment.baseUrl+"/auth/register-merchant", user, {headers: headers});
  }

  public loginUser(user: any): Observable<any>{
    const headers = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    return this.http.post(environment.baseUrl+"/auth/login", user, {headers: headers});
  }
}
