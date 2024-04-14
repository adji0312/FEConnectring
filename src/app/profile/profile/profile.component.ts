import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
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
  merchantData = new FormData();
  customerData = new FormData();
  merchant_name!: string;
  username!: string;
  address!: string;
  phone!: string;
  city!: string;
  postal_code!: string;
  description!: string;
  type!: string;
  profile_img!: string;
  picByte!: Blob;
  image_merchant!: Blob;
  changeImage!: boolean;
  customer!: Customer;


  // oldPassword = '';
  // newPassword = '';
  // confirmPassword = '';

  constructor(
    private authService: UserService,
    private formBuilder: FormBuilder,
    private merchantService: MerchantService,
    private customerService: CustomerService,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);

    this.editCustomerForm = this.formBuilder.group({
      name : ['', Validators.required],
      phone : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      username : [''],
    });
  }

  ngOnInit(): void {


    this.changeImage = false;
    console.log(this.loginuser);

    this.changePasswordForm = this.formBuilder.group({
      username: [''],
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    },
    {
      validators: this.passwordMatchValidator, 
    }
    );

    this.editMerchantForm = this.formBuilder.group({
      address : ['', Validators.required],
      city : ['', Validators.required],
      phone : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      postal_code : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      merchant_name : ['', Validators.required],
      description : [''],
      username : ['']
    });

    

    this.getDetailCustomerMerchant();

    if(this.loginuser.userEntity.flag == 2){
      this.merchantService.getMerchant(this.loginuser.userEntity.username, this.loginuser.accessToken).subscribe(
        (data) => {
          console.log(data);
          
          this.merchant_name = data.merchant_name;
          this.username = data.parent.username;
          this.address = data.address;
          this.city = data.city;
          this.phone = data.phone;
          this.postal_code = data.postal_code;
          this.description = data.description;
          this.profile_img = data.profile_img;
          this.type = data.type;
          this.picByte = data.picByte;
          this.profile_img = data.profile_img;
          this.catering = data;
        }
      )
    }
    else if(this.loginuser.userEntity.flag == 1){
      this.customerService.findCustomerByUsername(this.loginuser.userEntity.username, this.loginuser.accessToken).subscribe(
        (data) => {
          console.log(data);
          this.customer = data;
        }
      )
    }

    console.log(this.image_merchant);
    
    
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

    console.log(this.changePasswordForm.value);
    
    
    this.authService.changePassword(this.changePasswordForm.value, this.loginuser.accessToken).subscribe(
      (response: any) => {
        console.log(response);
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Change Password",
          showConfirmButton: true,
          timer: 1500
        })
        
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
        
        if(error.status == 401){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: "Wrong Old Password",
            showConfirmButton: true,
            timer: 1500
          })
        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: "Failed Change Password",
            showConfirmButton: true,
            timer: 1500
          })

        }
        
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
            profile_img : data.profile_img,
            picByte : data.picByte,
            image_merchant : data.profile_img,
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

    this.customerData.set('name', this.editCustomerForm.get('name')?.value);
    this.customerData.set('phone', this.editCustomerForm.get('phone')?.value);
    this.customerData.set('username', this.editCustomerForm.get('username')?.value);
    
    

    this.customerService.updateCustomer(this.customerData, this.loginuser.accessToken).subscribe(
      (response: Customer) => {
        console.log(response);
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success Update Profile',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Update Profile",
          showConfirmButton: true,
          timer: 1500
        });
      }
    );

    this.customerData.delete('name');
    this.customerData.delete('phone');
    this.customerData.delete('username');
    this.customerData.delete('profile_image');

    document.getElementById('edit-merchant-form')!.click();
    // window.location.reload();
    // this.editMerchantForm.reset();
  }
  
  onUpdateMerchant(){

    
    this.editMerchantForm.patchValue({
      username: this.loginuser.userEntity.username
    });
    console.log(this.editMerchantForm.value);
    if(this.editMerchantForm.invalid){
      return;
    }
    
    this.merchantData.set('merchant_name', this.editMerchantForm.get('merchant_name')?.value);
    this.merchantData.set('username', this.editMerchantForm.get('username')?.value);
    this.merchantData.set('address', this.editMerchantForm.get('address')?.value);
    this.merchantData.set('city', this.editMerchantForm.get('city')?.value);
    this.merchantData.set('phone', this.editMerchantForm.get('phone')?.value);
    this.merchantData.set('postal_code', this.editMerchantForm.get('postal_code')?.value);
    this.merchantData.set('description', this.editMerchantForm.get('description')?.value);

    this.merchantService.updateMerchant(this.merchantData, this.loginuser.accessToken).subscribe(
      (response: Merchant) => {
        console.log(response);
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Update Profile",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        console.log(error);

        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Update Profile",
          showConfirmButton: true,
          timer: 1500
        })
      }
    )

    this.merchantData.delete('merchant_name');
    this.merchantData.delete('username');
    this.merchantData.delete('address');
    this.merchantData.delete('city');
    this.merchantData.delete('phone');
    this.merchantData.delete('postal_code');
    this.merchantData.delete('desctiption');
    this.merchantData.delete('profile_image');
    document.getElementById('edit-merchant-form')!.click();
  }

  getImageUrl(blob: Blob) {
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  onFileChanged(event: any){
    if(event.target.files){
      const selectedFile = event.target.files[0];
      console.log(selectedFile);
      if(this.loginuser.userEntity.flag == 1){
        this.customerData.append('profile_image', selectedFile, selectedFile.name);
        this.changeImage = true;
      }else if(this.loginuser.userEntity.flag == 2){
        this.merchantData.append('profile_image', selectedFile, selectedFile.name);
        this.changeImage = true;
      }
    }
  }

  passwordMatchValidator(control: AbstractControl){
    return control.get('newPassword')?.value ===
      control.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  // passwordMatchValidator(control: AbstractControl){
  //   return control.get('newPassword')?.value ===
  //     control.get('confirmPassword')?.value
  //     ? null
  //     : { mismatch: true };
  // }

}
