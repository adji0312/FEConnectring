import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthService {

  private subject = new Subject<any>();
  private token: any;

  constructor(private router: Router) { }

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

}
