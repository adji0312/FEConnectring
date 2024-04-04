import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, switchMap, timer } from 'rxjs';
import { Customer } from 'src/app/user/customer/customer.model';
import { CustomerService } from 'src/app/user/customer/customer.service';
import { Merchant } from 'src/app/user/merchant/merchant.model';
import { MerchantService } from 'src/app/user/merchant/merchant.service';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public loginuser: any = {};
  changePasswordForm!: FormGroup;
  editMerchantForm!: FormGroup;
  editCustomerForm!: FormGroup;
  realTimeDataSubscription$!: Subscription;
  detailMerchant: Merchant = new Merchant;
  catering!: Merchant;


  // oldPassword = '';
  // newPassword = '';
  // confirmPassword = '';

  constructor(
    private authService: UserService,
    private formBuilder: FormBuilder,
    private merchantService: MerchantService,
    private customerService: CustomerService,
    private sanitizer: DomSanitizer
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  ngOnInit(): void {

    console.log(this.loginuser);

    this.changePasswordForm = this.formBuilder.group({
      username: [''],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

    this.editMerchantForm = this.formBuilder.group({
      address : [''],
      city : [''],
      phone : [''],
      postal_code : [''],
      merchant_name : [''],
      description : [''],
      username : [''],
    });

    this.editCustomerForm = this.formBuilder.group({
      name : [''],
      phone : [''],
      username : [''],
    });

    this.getDetailCustomerMerchant();

    if(this.loginuser.userEntity.flag == 2){
      this.merchantService.getMerchant(this.loginuser.userEntity.username, this.loginuser.accessToken).subscribe(
        (data) => {
          console.log(data);
          this.catering = data;
        }
      )
    }
    
  }

  onChangePassword(){

    console.log(this.changePasswordForm.value);

    // console.log(this.changePasswordForm.get('username')?.value);
    
    if(this.changePasswordForm.get('newPassword')?.value != this.changePasswordForm.get('confirmPassword')?.value){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: "New Password must same with Confirm Password",
        showConfirmButton: true,
        timer: 1500
      });
    }

    this.changePasswordForm.patchValue({
      username: this.loginuser.userEntity.username
    });
    
    this.authService.changePassword(this.changePasswordForm.value, this.loginuser.accessToken).subscribe(
      (response: any) => {
        console.log(response);
        
        // Swal.fire({
        //   position: 'center',
        //   icon: 'success',
        //   title: "Success Change Password",
        //   showConfirmButton: true,
        //   timer: 1500
        // })
        
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        
        // Swal.fire({
        //   position: 'center',
        //   icon: 'error',
        //   title: "Failed Change Password",
        //   showConfirmButton: true,
        //   timer: 1500
        // })
        
      }
    )

    this.changePasswordForm.reset();
    document.getElementById('change-password-form')!.click();
  }

  getDetailCustomerMerchant(){
    //CUSTOMER
    if(this.loginuser.userEntity.flag == 1){
      this.editMerchantForm.patchValue({
        username: this.loginuser.userEntity.username
      });

      this.customerService.findCustomerByUsername(this.editMerchantForm.get('username')?.value, this.loginuser.accessToken).subscribe(
        data => {
          console.log(data);
          
          this.editCustomerForm.patchValue({
            name : data.name,
            phone : data.phone
          });
        }
      )

    }else{

      this.editMerchantForm.patchValue({
        username: this.loginuser.userEntity.username
      });
      
      this.merchantService.getMerchant(this.editMerchantForm.get('username')?.value, this.loginuser.accessToken).subscribe(
        data => {
          console.log(data);
          
          // this.detailMerchant = data;
          this.editMerchantForm.patchValue({
            address : data.address,
            city : data.city,
            phone : data.phone,
            postal_code : data.postal_code,
            merchant_name : data.merchant_name,
            description : data.description,
          });
        }
      )
        console.log(this.detailMerchant);
        
    }
  }

  onUpdateCustomer(){

    this.editCustomerForm.patchValue({
      username: this.loginuser.userEntity.username
    });
    if(this.editCustomerForm.invalid){
      return;
    }

    console.log(this.editCustomerForm.value);
    
    

    this.customerService.updateCustomer(this.editCustomerForm.value, this.loginuser.accessToken).subscribe(
      (response: Customer) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success Update Profile',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Update Profile",
          showConfirmButton: true,
          timer: 1500
        });
      }
    );

    document.getElementById('edit-merchant-form')!.click();
    // this.editMerchantForm.reset();
  }
  
  onUpdateMerchant(){

    this.editMerchantForm.patchValue({
      username: this.loginuser.userEntity.username
    });
    if(this.editMerchantForm.invalid){
      return;
    }

    console.log(this.editMerchantForm.value);
    
    

    this.merchantService.updateMerchant(this.editMerchantForm.value, this.loginuser.accessToken).subscribe(
      (response: Merchant) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success Update Profile',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Update Profile",
          showConfirmButton: true,
          timer: 1500
        });
      }
    );

    document.getElementById('edit-merchant-form')!.click();
    // this.editMerchantForm.reset();
  }

  getImageUrl(blob: Blob) {
    // console.log(blob);
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

}
