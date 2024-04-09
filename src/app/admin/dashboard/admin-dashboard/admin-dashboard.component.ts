import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, switchMap, timer } from 'rxjs';
import { Merchant } from 'src/app/user/merchant/merchant.model';
import { MerchantService } from 'src/app/user/merchant/merchant.service';
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
  public loginuser: any = {};
  merchants!: Merchant[];
  editMerchant: Merchant = new Merchant;
  deleteMerchant: Merchant = new Merchant;
  foto: any;
  selectedFile!: File;
  formData = new FormData();
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
      phone : ['', [Validators.required]],
      postal_code : ['', [Validators.required]],
      merchant_name : ['', [Validators.required]],
      // image_merchant : ['',],
    });

    this.editMerchantForm = this.formBuilder.group({
      username : ['', [Validators.required]],
      address : ['', [Validators.required]],
      city : ['', [Validators.required]],
      phone : ['', [Validators.required]],
      postal_code : ['', [Validators.required]],
      merchant_name : ['', [Validators.required]],
    });
    
  }

  private getMerchants(){
    // this.merchantService.getAllMerchant(this.loginuser.accessToken).subscribe(
    //   (response) => {
    //     console.log(response);
        
    //   }
    // )
    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.merchantService.getAllMerchant(this.loginuser.accessToken)))
      .subscribe(data => {
        this.merchants = data.sort();

        // let objectURL = 'data:image/jpeg;base64,' + data[1].picByte;

        //  this.foto = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        //  console.log(this.foto);
         
        // console.log(this.merchants);
        
    });
  }

  btnDeleteMerchant(merchant: Merchant){
    console.log(this.deleteMerchant);
    
    this.merchantService.deleteMerchant(this.deleteMerchant.parent.username, this.loginuser.accessToken).subscribe(
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
      });
    }else if(mode === 'delete'){
      this.deleteMerchant = merchant;
      console.log(this.deleteMerchant.parent.username);
      
    }
    
  }

  onUpdateMerchant(){
    if(this.editMerchantForm.invalid){
      return;
    }

    console.log(this.editMerchantForm.value);
    

    this.merchantService.updateMerchant(this.editMerchantForm.value, this.loginuser.accessToken).subscribe(
      (response: Merchant) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success Update Merchant',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
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
  }

  onSubmit(){

    console.log(this.registMerchantForm.value);
    
    this.formData.append('merchant_name', this.registMerchantForm.get('merchant_name')?.value);
    this.formData.append('username', this.registMerchantForm.get('username')?.value);
    this.formData.append('address', this.registMerchantForm.get('address')?.value);
    this.formData.append('city', this.registMerchantForm.get('city')?.value);
    this.formData.append('phone', this.registMerchantForm.get('phone')?.value);
    this.formData.append('postal_code', this.registMerchantForm.get('postal_code')?.value);

    this.authService.regisMerchant(this.formData, this.loginuser.accessToken).subscribe(
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
    this.closeAddMerchantModal();
    
    // this.http.post('http://localhost:8080/auth/register-merchant', this.formData)
    // .subscribe(response => {
    //   console.log('Registration successful:', response);
    // }, error => {
    //   console.error('Error registering merchant:', error);
    // });
  }

  onFileChanged(event: any){
    
    if(event.target.files){
      const selectedFile = event.target.files[0];
      console.log(selectedFile);
      
      this.formData.append('profile_image', selectedFile, selectedFile.name);
    }
  }

  closeAddMerchantModal(){
    if(this.closeAddMerchant){
      this.closeAddMerchant.nativeElement.click();
    }
  }

}
