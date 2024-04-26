import { UpperCasePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginAuthService } from '../auth/login-auth.service';
import { UserService } from '../user/user.service';
import { Merchant } from '../user/merchant/merchant.model';
import Swal from 'sweetalert2';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('closeAddMerchantBtn') closeAddMerchant: ElementRef | undefined;
  public user: any = {};
  public loginuser: any = {};
  loginForm!: FormGroup;
  userForgotPasswordForm!: FormGroup;
  registMerchantForm!: FormGroup;
  formData = new FormData();


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

    this.registMerchantForm = this.formBuilder.group({
      username : ['', [Validators.required]],
      address : ['', [Validators.required]],
      city : ['', [Validators.required]],
      phone : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      postal_code : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      merchant_name : ['', [Validators.required]],
      // image_merchant : ['',],
    });
  }

  onSubmit(){

    console.log(this.registMerchantForm.value);
    
    this.formData.append('merchant_name', this.registMerchantForm.get('merchant_name')?.value);
    this.formData.append('username', this.registMerchantForm.get('username')?.value);
    this.formData.append('address', this.registMerchantForm.get('address')?.value);
    this.formData.append('city', this.registMerchantForm.get('city')?.value);
    this.formData.append('phone', this.registMerchantForm.get('phone')?.value);
    this.formData.append('postal_code', this.registMerchantForm.get('postal_code')?.value);

    this.authService.regisMerchant(this.formData).subscribe(
      (response: Merchant) => {
        console.log(response);
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Register, Waiting Admin Confirmation",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error.error,
          showConfirmButton: true,
          timer: 1500
        })
      }
    )

    this.formData.delete('merchant_name');
    this.formData.delete('username');
    this.formData.delete('address');
    this.formData.delete('city');
    this.formData.delete('phone');
    this.formData.delete('postal_code');
    this.formData.delete('profile_image');
    this.registMerchantForm.reset();
    this.closeAddMerchantModal();
  }

  closeAddMerchantModal(){
    if(this.closeAddMerchant){
      this.closeAddMerchant.nativeElement.click();
    }
  }

  onFileChanged(event: any){
    
    if(event.target.files){
      const selectedFile = event.target.files[0];
      console.log(selectedFile);
      
      this.formData.append('profile_image', selectedFile, selectedFile.name);
    }
  }

  loginUser(user: any){

    this.authService.loginUser(user).subscribe((response) => {
      if(response){
        console.log(response);
        
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
      console.log(error);
      this.toastr.error('Invalid Username or Password!', 'Login - Failed');
    })

  }

}
