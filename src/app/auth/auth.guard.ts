import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public loginuser: any = {};
  constructor(private router: Router){}

  ngOnInit(): void{
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
    
  }
  // this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      
        if(localStorage.getItem('currentUser')){
          return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
  
}
