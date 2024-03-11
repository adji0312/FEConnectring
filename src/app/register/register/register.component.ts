import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginAuthService } from 'src/app/auth/login-auth.service';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  public user: any = {};
  regisForm!: FormGroup;

  constructor(
    private router: Router, 
    private authService: UserService, 
    private formBuilder : FormBuilder, 
    private toastr: ToastrService,
    private http: HttpClient) {

    this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.regisForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', Validators.required],
    })
  }

  register(){
    console.log(this.regisForm.value);

    
    
    this.authService.regisUser(this.regisForm.value).subscribe(
      (response: User) => {
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Register",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        // Swal.fire({
        //   position: 'center',
        //   icon: 'error',
        //   title: this.translate.instant('alert.failed.add', {value: 'User'}),
        //   showConfirmButton: true,
        //   timer: 1500
        // })
      }
    );
    this.router.navigate(['/login']);
    // console.log('012938123');

    // this.authService.regisUser(user).subscribe((response) => {
    //   if(response){
    //     console.log(response);
        
    //   }
    // }, (error) => {
      
    // });
    
    // this.userService.loginUser(user).subscribe((response) => {
    //   if(response){
    //     // console.log(response);
    //     // console.log(user);
    //     if(response.token){
    //       // console.log(response);
    //       localStorage.setItem('currentUser', JSON.stringify(response));
    //       this.router.navigate(['/dashboard']);
    //       this.toastr.success('You are success login', 'Login - Success');

    //       const jwtToken = JSON.parse(atob(response.token.split('.')[1]));
    //       const expires = new Date(jwtToken.exp * 1000);
    //       const timeout = expires.getTime() - Date.now();

    //       setTimeout(() => this.authService.logout(), timeout);
    //     }
    //   }
    // }, (error) => {
    //   // console.log(error);
    //   this.toastr.error('Invalid Username or Password!', 'Login - Failed');
    // })
    
  }

}
