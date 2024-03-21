import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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

  registMerchantForm!: FormGroup;
  editMerchantForm!: FormGroup;
  public loginuser: any = {};
  merchants!: Merchant[];
  editMerchant: Merchant = new Merchant;
  deleteMerchant: Merchant = new Merchant;
  selectedFile!: File;

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

    console.log(this.loginuser);
    

    this.loadData();

    this.registMerchantForm = this.formBuilder.group({
      username : ['', [Validators.required]],
      address : ['', [Validators.required]],
      city : ['', [Validators.required]],
      phone : ['', [Validators.required]],
      postal_code : ['', [Validators.required]],
      merchant_name : ['', [Validators.required]],
      image_merchant : ['',],
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

  registMerchant(){

    console.log(this.registMerchantForm.value);
    
    // this.authService.regisMerchant(this.registMerchantForm.value, this.loginuser.accessToken).subscribe((response) => {
    //   Swal.fire({
    //     position: 'center',
    //     icon: 'success',
    //     title: 'Success Add Merchant',
    //     showConfirmButton: true,
    //     timer: 1500
    //   })
    // }
    // )
    // document.getElementById('add-merchant-form')!.click();
    // this.registMerchantForm.reset();
    
  }

  private getMerchants(){
    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.merchantService.getAllMerchant(this.loginuser.accessToken)))
      .subscribe(data => {
        
        this.merchants = data.sort();
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

    this.merchantService.updateMerchant(this.editMerchantForm.value, this.editMerchant.id, this.loginuser.accessToken).subscribe(
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

  public onFileChanged(event: any){
    
    if(event.target.files){
      const file = event.target.files[0];

      // const merchant: Merchant{
      //   file: file,
      //   url: this.sanitizer.bypassSecurityTrustUrl{

      //   }
      // }
    }
  }

}
