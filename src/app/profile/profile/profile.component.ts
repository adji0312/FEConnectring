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
  formData = new FormData();
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
      profile_img : [''],
      picByte : [''],
      image_merchant : [''],
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
          // console.log(data);
          // this.formData.append('merchant_name', data.merchant_name);
          // this.formData.append('username', data.parent.username);
          // this.formData.append('address', data.address);
          // this.formData.append('city', data.city);
          // this.formData.append('phone', data.phone);
          // this.formData.append('postal_code', data.postal_code);
          // this.formData.append('description', data.description);
          // this.formData.append('profile_img', data.profile_img);
          // this.formData.append('picByte', data.picByte);
          // this.formData.append('type', data.type);
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

    // this.formData.append('merchant_name', this.merchant_name);
    // this.formData.append('username', this.username);
    // this.formData.append('address', this.address);
    // this.formData.append('city', this.city);
    // this.formData.append('phone', this.phone);
    // this.formData.append('postal_code', this.postal_code);
    // this.formData.append('description', this.description);

    // console.log(this.formData.get('merchant_name'));
    
    this.editMerchantForm.patchValue({
      username: this.loginuser.userEntity.username
    });
    if(this.editMerchantForm.invalid){
      return;
    }

    console.log(this.editMerchantForm.value);
    this.formData.append('merchant_name', this.editCustomerForm.get('merchant_name')?.value);
    this.formData.append('username', this.editCustomerForm.get('username')?.value);
    this.formData.append('address', this.editCustomerForm.get('address')?.value);
    this.formData.append('city', this.editCustomerForm.get('city')?.value);
    this.formData.append('phone', this.editCustomerForm.get('phone')?.value);
    this.formData.append('postal_code', this.editCustomerForm.get('postal_code')?.value);
    // this.formData.append('image_merchant', this.editCustomerForm.get('description')?.value);

    
    

    this.merchantService.updateMerchant(this.formData, this.loginuser.accessToken).subscribe(
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
  }

  inputMerchantName(){
    console.log(this.merchant_name);
    
    this.formData.append('merchant_name', this.merchant_name);
    console.log(this.formData.get('merchant_name'));
    
  }

  getImageUrl(blob: Blob) {
    // console.log(blob);
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  onFileChanged(event: any){
    if(event.target.files){
      const selectedFile = event.target.files[0];
      console.log(selectedFile);
      
      this.formData.append('image_merchant', selectedFile, selectedFile.name);
      // console.log(this.formData.get('image_merchant'));
      
      // this.selectedFile = event.target.files[0];
      // console.log(this.selectedFile);
    }
  }

}
