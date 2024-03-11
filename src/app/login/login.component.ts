import { UpperCasePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginAuthService } from '../auth/login-auth.service';
import { UserService } from '../user/user.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: any = {};
  public loginuser: any = {};
  loginForm!: FormGroup;
  

  constructor(
    private router: Router, 
    private authService: UserService, 
    private formBuilder : FormBuilder, 
    private toastr: ToastrService,
    private http: HttpClient) {

    this.authService.isLoggedIn();
   }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    })
  }

  loginUser(user: any){
    
    this.authService.loginUser(user).subscribe((response) => {
      if(response){
        if(response.accessToken){
          localStorage.setItem('currentUser', JSON.stringify(response));
          
          if(response.userEntity.flag == 0){
            this.router.navigate(['/admin-dashboard']);
          }else if(response.userEntity.flag == 1){
            this.router.navigate(['/home']);
          }else if(response.userEntity.flag == 2){
            this.router.navigate(['/merchant-dashboard']);
          }
          this.toastr.success('You are success login', 'Login - Success');

          const jwtToken = JSON.parse(atob(response.accessToken.split('.')[1]));
          const expires = new Date(jwtToken.exp * 1000);
          const timeout = expires.getTime() - Date.now();

          setTimeout(() => this.authService.logout(), timeout);
        }
      }
    }, (error) => {
      // console.log(error);
      this.toastr.error('Invalid Username or Password!', 'Login - Failed');
    })
    
  }

}
