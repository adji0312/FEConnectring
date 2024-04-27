import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, switchMap, timer } from 'rxjs';
import { Merchant } from 'src/app/user/merchant/merchant.model';
import { MerchantService } from 'src/app/user/merchant/merchant.service';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';
import Swal from 'sweetalert2';
declare var $: any; 

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  @ViewChild('closeAddMerchantBtn') closeAddMerchant: ElementRef | undefined;
  registMerchantForm!: FormGroup;
  editMerchantForm!: FormGroup;
  resetMerchantForm!: FormGroup;
  public loginuser: any = {};
  merchants!: Merchant[];
  editMerchant: Merchant = new Merchant;
  deleteMerchant: Merchant = new Merchant;
  resetPasswordMerchant: Merchant = new Merchant;
  foto: any;
  selectedFile!: File;
  formData = new FormData();
  editData = new FormData();
  merchant_name!: string;
  username!: string;
  address!: string;
  phone!: string;
  city!: string;
  postal_code!: string;

  realTimeDataSubscription$!: Subscription;
  
  private loadData(){
    this.getMerchants();
  }
  constructor(
    private router: Router, 
    private authService: UserService, 
    private formBuilder : FormBuilder, 
    private toastr: ToastrService,
    private http: HttpClient,
    private merchantService: MerchantService,
    private sanitizer: DomSanitizer) {
      this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
    }

  ngOnInit(): void {

    // console.log(this.loginuser);
    

    this.loadData();

    this.registMerchantForm = this.formBuilder.group({
      username : ['', [Validators.required]],
      address : ['', [Validators.required]],
      city : ['', [Validators.required]],
      phone : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      postal_code : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      merchant_name : ['', [Validators.required]],
      // image_merchant : ['',],
    });

    this.editMerchantForm = this.formBuilder.group({
      username : ['', [Validators.required]],
      address : ['', [Validators.required]],
      city : ['', [Validators.required]],
      phone : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      postal_code : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      merchant_name : ['', [Validators.required]],
      description : [''],
    });

    this.resetMerchantForm = this.formBuilder.group({
      username : ['']
    });
    
  }

  private getMerchants(){
    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.merchantService.getAllMerchant(this.loginuser.accessToken)))
      .subscribe(data => {
        // console.log(data);
        this.merchants = data.sort();
    });
  }

  btnDeleteMerchant(){
    console.log(this.deleteMerchant);
    console.log(this.editMerchantForm.value);
    
    this.merchantService.deleteMerchant(this.editMerchantForm.value, this.loginuser.accessToken).subscribe(
      (response: Merchant) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success Delete Merchant',
          showConfirmButton: true,
          timer: 1500
        })
      }, 
      (error: HttpErrorResponse) => {
        console.log(error);
        
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Delete Merchant",
          showConfirmButton: true,
          timer: 1500
        });
      }
    )

    document.getElementById('delete-merchant-form')!.click();
  }

  onOpenModal(merchant: Merchant, mode: string){
    console.log(merchant);
    // console.log(mode);

    if(mode == 'edit'){
      this.editMerchant = merchant;
      this.editMerchantForm.setValue({
        username : this.editMerchant.parent.username,
        address : this.editMerchant.address,
        city : this.editMerchant.city,
        phone : this.editMerchant.phone,
        postal_code : this.editMerchant.postal_code,
        merchant_name : this.editMerchant.merchant_name,
        description : this.editMerchant.description,
      });
    }else if(mode === 'delete'){
      this.deleteMerchant = merchant;
      console.log(this.deleteMerchant.parent.username);
      this.editMerchantForm.setValue({
        username : merchant.parent.username,
        address : merchant.address,
        city : merchant.city,
        phone : merchant.phone,
        postal_code : merchant.postal_code,
        merchant_name : merchant.merchant_name,
        description : merchant.description,
      });
    }else if(mode === 'reset'){
      this.resetPasswordMerchant = merchant;
      console.log(this.resetPasswordMerchant);
      
    }
    
  }

  resetPassword(){

    this.resetMerchantForm.patchValue({
      username: this.resetPasswordMerchant.parent.username
    });
    this.authService.resetPassword(this.resetMerchantForm.value, this.loginuser.accessToken).subscribe(
      (response: User) => {
        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Reset Merchant's Password",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        console.log(error);

        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Reset Merchant's Password",
          showConfirmButton: true,
          timer: 1500
        });
        
      }
    )

    document.getElementById('reset-merchant-form')!.click();
    this.resetMerchantForm.reset();
  }

  onUpdateMerchant(){
    if(this.editMerchantForm.invalid){
      return;
    }
    this.editData.set('merchant_name', this.editMerchantForm.get('merchant_name')?.value);
    this.editData.set('username', this.editMerchantForm.get('username')?.value);
    this.editData.set('address', this.editMerchantForm.get('address')?.value);
    this.editData.set('city', this.editMerchantForm.get('city')?.value);
    this.editData.set('phone', this.editMerchantForm.get('phone')?.value);
    this.editData.set('postal_code', this.editMerchantForm.get('postal_code')?.value);

    console.log(this.editMerchantForm.value);
    

    this.merchantService.updateMerchant(this.editData, this.loginuser.accessToken).subscribe(
      (response: Merchant) => {
        console.log(response);
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success Update Merchant',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Update Merchant",
          showConfirmButton: true,
          timer: 1500
        });
      }
    );

    document.getElementById('edit-merchant-form')!.click();
    this.editMerchantForm.reset();
    this.editData.delete('profile_image');

    this.editData.delete('merchant_name');
    this.editData.delete('username');
    this.editData.delete('address');
    this.editData.delete('city');
    this.editData.delete('phone');
    this.editData.delete('postal_code');
    this.editData.delete('profile_image');
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
          title: "Success Register Merchant",
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

  onFileChanged(event: any){
    
    if(event.target.files){
      const selectedFile = event.target.files[0];
      console.log(selectedFile);
      
      this.formData.append('profile_image', selectedFile, selectedFile.name);
      this.editData.append('profile_image', selectedFile, selectedFile.name);
    }
  }

  closeAddMerchantModal(){
    if(this.closeAddMerchant){
      this.closeAddMerchant.nativeElement.click();
    }
  }

  getImageUrl(blob: Blob) {
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

}
