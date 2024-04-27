import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginAuthService } from 'src/app/auth/login-auth.service';
import { UsernamecheckService } from 'src/app/auth/usernamecheck.service';
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
  formRegis = new FormData();
  // name!: string;
  // username!: string;
  // phone!: string;
  // password!: string;
  // confirm_password!: string;

  constructor(
    private router: Router, 
    private authService: UserService, 
    private formBuilder : FormBuilder, 
    private toastr: ToastrService,
    private http: HttpClient,
    private usernameValidator: UsernamecheckService) {

    this.authService.isLoggedIn();

    this.regisForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9]*$")], this.usernameValidator.validateUsernameNotTaken.bind(this.usernameValidator)],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(8)]],
    },
    {
      validators: this.passwordMatchValidator, 
    }
    )
  }

  ngOnInit(): void {
    
  }

  passwordMatchValidator(control: AbstractControl){
    return control.get('password')?.value ===
      control.get('confirmpassword')?.value
      ? null
      : { mismatch: true };
  }

  register(){
    console.log(this.regisForm.value);
    this.formRegis.append('name', this.regisForm.get('name')?.value);
    this.formRegis.append('username', this.regisForm.get('username')?.value);
    this.formRegis.append('phone', this.regisForm.get('phone')?.value);
    this.formRegis.append('password', this.regisForm.get('password')?.value);
    
    this.authService.regisUser(this.formRegis).subscribe(
      (response: User) => {
        console.log(response);
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Register",
          showConfirmButton: true,
          timer: 1500
        })
        this.router.navigate(['/login']);
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
    );

    this.formRegis.delete('name');
    this.formRegis.delete('username');
    this.formRegis.delete('phone');
    this.formRegis.delete('password');
    this.formRegis.delete('profile_image');
  }

  onFileChanged(event: any){
    
    if(event.target.files){
      const selectedFile = event.target.files[0];
      console.log(selectedFile);
      
      this.formRegis.append('profile_image', selectedFile, selectedFile.name);
    }
  }

}
