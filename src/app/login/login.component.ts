import { UpperCasePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginAuthService } from '../auth/login-auth.service';
import { UserService } from '../user/user.service';
import { Merchant } from '../user/merchant/merchant.model';
import Swal from 'sweetalert2';
import { CustomerService } from '../user/customer/customer.service';
import { MerchantService } from '../user/merchant/merchant.service';
import { UsernamecheckService } from '../auth/usernamecheck.service';

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
  registMerchantForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  formData = new FormData();


  constructor(
    private router: Router,
    private authService: UserService,
    private formBuilder : FormBuilder,
    private toastr: ToastrService,
    private http: HttpClient,
    private customerService: CustomerService,
    private merchantService: MerchantService,
    private usernameValidator: UsernamecheckService) {

    this.authService.isLoggedIn();
   }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });

    this.registMerchantForm = this.formBuilder.group({
      username : ['', [Validators.required,  Validators.pattern("^[a-zA-Z0-9]*$")], this.usernameValidator.validateUsernameNotTaken.bind(this.usernameValidator)],
      address : ['', [Validators.required]],
      city : ['', [Validators.required]],
      phone : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      postal_code : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      merchant_name : ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(8)]],
      // image_merchant : ['',],
    },
    {
      validators: this.passwordMatchValidator,
    }
    );

    this.forgotPasswordForm = this.formBuilder.group({
      username : ['', [Validators.required]]
    });
  }

  onForgotButton(){
    // console.log(this.forgotPasswordForm.value);

    this.authService.checkUsername(this.forgotPasswordForm.controls['username'].value).subscribe(
      (response) => {
        if(response != null){

          if(response.flag == 1){
            this.customerService.findCustomerWithoutToken(this.forgotPasswordForm.value).subscribe(
              (res) => {
                console.log(res);
                
                if(res.is_delete == true){
                  Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: "Failed Send Request",
                    showConfirmButton: true,
                    timer: 1500
                  })
                }else if(res.parent.is_request == 0){
                  Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: "You Already Send Request",
                    showConfirmButton: true,
                    timer: 1500
                  })
                }else{
                  this.forgotPasswordForm.setValue({
                    username : res.parent.username
                  })
                  this.authService.sendRequest(this.forgotPasswordForm.value).subscribe(
                    (data) => {
                      Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: "Success Send Request",
                        showConfirmButton: true,
                        timer: 1500
                      })
                      this.forgotPasswordForm.reset();
                    },
                    (error: HttpErrorResponse) => {
                      Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: "Failed Send Request",
                        showConfirmButton: true,
                        timer: 1500
                      })
                    }
                  )
                }

              }
            )
            document.getElementById('forgot-form')!.click();
            this.forgotPasswordForm.reset();
          }else{
            this.merchantService.findMerchantWithoutToken(this.forgotPasswordForm.value).subscribe(
              (res) => {
                // console.log(res);

                if((res.is_delete == 0 && res.is_active == 0) || (res.is_delete == 0 && res.is_active == 1)){
                  Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: "Failed Send Request",
                    showConfirmButton: true,
                    timer: 1500
                  })
                }else if(res.parent.is_request == 0){
                  Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: "You Already Send Request",
                    showConfirmButton: true,
                    timer: 1500
                  })
                }else{
                  this.forgotPasswordForm.setValue({
                    username : res.parent.username
                  })
                  // console.log(this.forgotPasswordForm.value);
                  this.authService.sendRequest(this.forgotPasswordForm.value).subscribe(
                    (data) => {
                      // console.log(data);

                      Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: "Success Send Request",
                        showConfirmButton: true,
                        timer: 1500
                      })
                      this.forgotPasswordForm.reset();
                    },
                    (error: HttpErrorResponse) => {
                      // console.log(error);

                      Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: "Failed Send Request",
                        showConfirmButton: true,
                        timer: 1500
                      })
                    }
                  )
                }

              }
            )
            document.getElementById('forgot-form')!.click();
            this.forgotPasswordForm.reset();

          }
        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: "Username Not Found",
            showConfirmButton: true,
            timer: 1500
          })

        }

      }
    )
  }

  onSubmit(){

    // console.log(this.registMerchantForm.value);

    this.formData.append('merchant_name', this.registMerchantForm.get('merchant_name')?.value);
    this.formData.append('username', this.registMerchantForm.get('username')?.value);
    this.formData.append('address', this.registMerchantForm.get('address')?.value);
    this.formData.append('city', this.registMerchantForm.get('city')?.value);
    this.formData.append('phone', this.registMerchantForm.get('phone')?.value);
    this.formData.append('postal_code', this.registMerchantForm.get('postal_code')?.value);
    this.formData.append('password', this.registMerchantForm.get('password')?.value);

    this.authService.regisMerchant(this.formData).subscribe(
      (response: Merchant) => {
        // console.log(response);

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Register, Waiting Admin Confirmation",
          showConfirmButton: true,
          timer: 1500
        })
        window.location.reload();
      },
      (error: HttpErrorResponse) => {
        // console.log(error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error.error,
          showConfirmButton: true,
          timer: 1500
        })
        window.location.reload();
      }
    )

    this.formData.delete('merchant_name');
    this.formData.delete('username');
    this.formData.delete('address');
    this.formData.delete('city');
    this.formData.delete('phone');
    this.formData.delete('postal_code');
    this.formData.delete('password');
    this.formData.delete('profile_image');
    this.registMerchantForm.get('profile_image')?.setValue(null);
    this.registMerchantForm.reset();
    this.closeAddMerchantModal();

  }

  closeAddMerchantModal(){
    if(this.closeAddMerchant){
      this.closeAddMerchant.nativeElement.click();
    }
  }

  passwordMatchValidator(control: AbstractControl){
    return control.get('password')?.value ===
      control.get('confirmpassword')?.value
      ? null
      : { mismatch: true };
  }

  onFileChanged(event: any){

    if(event.target.files){
      const selectedFile = event.target.files[0];
      // console.log(selectedFile);

      this.formData.append('profile_image', selectedFile, selectedFile.name);
    }
  }

  loginUser(user: any){
    // console.log(user);


    this.authService.loginUser(user).subscribe((response) => {
      if(response){
        // console.log(response);

        if(response.accessToken){
          localStorage.setItem('currentUser', JSON.stringify(response));

          if(response.userEntity.flag == 0){
            this.router.navigate(['/admin-dashboard']);
            this.toastr.success('You are success login', 'Login - Success');

            const jwtToken = JSON.parse(atob(response.accessToken.split('.')[1]));
            const expires = new Date(jwtToken.exp * 1000);
            const timeout = expires.getTime() - Date.now();

            setTimeout(() => this.authService.logout(), timeout);
          }else if(response.userEntity.flag == 1){
            this.customerService.findCustomerByUsername(user.username, response.accessToken).subscribe(
              (response) => {
                if(response.is_delete == true){
                  this.router.navigate(['/login']);
                  this.toastr.error('Invalid Username or Password!', 'Login - Failed');
                }else{
                  this.router.navigate(['/home']);
                  this.toastr.success('You are success login', 'Login - Success');

                  const jwtToken = JSON.parse(atob(response.accessToken.split('.')[1]));
                  const expires = new Date(jwtToken.exp * 1000);
                  const timeout = expires.getTime() - Date.now();

                  setTimeout(() => this.authService.logout(), timeout);
                }
              }
            )
          }else if(response.userEntity.flag == 2){
            this.merchantService.getMerchant(user.username, response.accessToken).subscribe(
              (response) => {
                console.log(response);
                
                if(response.is_delete == true || response.is_delete == null){
                  this.router.navigate(['/login']);
                  this.toastr.error('Invalid Username or Password!', 'Login - Failed');
                  // return;
                }else{
                  this.router.navigate(['/merchant-dashboard']);
                  this.toastr.success('You are success login', 'Login - Success');

                  const jwtToken = JSON.parse(atob(response.accessToken.split('.')[1]));
                  const expires = new Date(jwtToken.exp * 1000);
                  const timeout = expires.getTime() - Date.now();

                  setTimeout(() => this.authService.logout(), timeout);
                }

              }
            )
          }
        }
      }
    }, (error) => {
      // console.log(error);
      this.toastr.error('Invalid Username or Password!', 'Login - Failed');
    })

  }

}
