import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, switchMap, timer } from 'rxjs';
import { ChatService } from 'src/app/chat/chat.service';
import { CustomerService } from 'src/app/user/customer/customer.service';
import { Merchant } from 'src/app/user/merchant/merchant.model';
import { MerchantService } from 'src/app/user/merchant/merchant.service';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-request',
  templateUrl: './list-request.component.html',
  styleUrls: ['./list-request.component.css']
})
export class ListRequestComponent implements OnInit {

  public loginuser: any = {};
  merchants!: Merchant[];
  users!: User[];
  realTimeDataSubscription$!: Subscription;
  x!: number;
  viewCateringForm!: FormGroup;
  requestForm!: FormGroup;
  viewDetailUser!: FormGroup;
  number!: any;
  splitnumber!: string;

  private loadData(){
    this.getMerchants();
  }

  constructor(
    private merchantService: MerchantService,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private formBuilder : FormBuilder,
    private customerService: CustomerService,
    private chatService: ChatService,
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  ngOnInit(): void {
    this.x = 0;
    this.loadData();

    this.viewCateringForm = this.formBuilder.group({
      username : [''],
      address : [''],
      city : [''],
      phone : [''],
      postal_code : [''],
      merchant_name : [''],
      description : [''],
    });

    this.requestForm = this.formBuilder.group({
      username : [''],
      phone : ['']
    });
  }

  private getMerchants(){
    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.merchantService.getAllMerchantRequest(this.loginuser.accessToken)))
      .subscribe(data => {
        // console.log(data);
        // if(data.is_active == 1){
          this.merchants = data.sort();
          // console.log(this.merchants);

        // }
    });
  }

  private getUsers(){
    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.userService.allUsers(this.loginuser.accessToken)))
      .subscribe(data => {
        this.users = data.sort();
        // console.log(this.users);
        
        for(let i = 0 ; i < data.length ; i++){
          // console.log(data[i].flag);
          if(data[i].flag == 0 || data[i].is_request == null){
            continue;
          }

          if(data[i].flag == 1){
            this.customerService.findCustomerByUsername(data[i].username, this.loginuser.accessToken).subscribe(
              (resp) => {
                // console.log(resp);
                // this.users = resp;
                // console.log(this.users);
                
              }
            )
          }else{

          }
        }
      })
  }

  getImageUrl(blob: Blob) {
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  onOpenModal(merchant: Merchant, mode: string){

    if(mode === 'view'){
      this.viewCateringForm.setValue({
        username : merchant.parent.username,
        address : merchant.address,
        city : merchant.city,
        phone : merchant.phone,
        postal_code : merchant.postal_code,
        merchant_name : merchant.merchant_name,
        description : merchant.description,
      });
    }else if(mode === 'accept' || mode == 'reject'){
      this.viewCateringForm.setValue({
        username : merchant.parent.username,
        address : merchant.address,
        city : merchant.city,
        phone : merchant.phone,
        postal_code : merchant.postal_code,
        merchant_name : merchant.merchant_name,
        description : merchant.description,
      });
      this.splitnumber = '62' + this.viewCateringForm.get('phone')?.value.substring(1);
      // console.log(this.splitnumber);
    }

  }

  onRequestModal(user: User){
    // console.log(user);

    if(user.flag == 1){
      this.customerService.findCustomerByUsername(user.username, this.loginuser.accessToken).subscribe(
        (res) => {
          // console.log(res);
          this.requestForm.setValue({
            username : user.username,
            phone : res.phone
          });
          this.splitnumber = '62' + this.requestForm.get('phone')?.value.substring(1);
          // console.log(this.splitnumber);

        }
      )
    }else if(user.flag == 2){
      this.merchantService.getMerchant(user.username, this.loginuser.accessToken).subscribe(
        (res) => {
          // console.log(res);
          this.requestForm.setValue({
            username : user.username,
            phone : res.phone
          });
          this.splitnumber = '62' + this.requestForm.get('phone')?.value.substring(1);
          // console.log(this.splitnumber);

        }
      )
    }

  }

  clickCatering(){
    this.x = 0;
    this.loadData();
  }

  clickCustomer(){
    this.x = 1;
    this.getUsers();
  }

  acceptCatering(){
    // console.log(this.viewCateringForm.value);

    this.merchantService.acceptMerchant(this.viewCateringForm.value, this.loginuser.accessToken).subscribe(
      (response) => {
        // console.log(response);

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success Accept Catering',
          showConfirmButton: true,
          timer: 1500
        })

      },
      (error: HttpErrorResponse) => {
        // console.log(error);

        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Accept Catering",
          showConfirmButton: true,
          timer: 1500
        });
      }
    )
    let link = 'https://wa.me/' + this.splitnumber + '?text=Your%20request%20has%20been%20successfully%20received,%20please%20log%20in%20to%20the%20application!';
    window.open(link);
    document.getElementById('accept-catering')!.click();
    this.splitnumber = '';
  }

  rejectCatering(){
    // console.log(this.viewCateringForm.value);

    this.merchantService.rejectMerchant(this.viewCateringForm.get('username')?.value, this.loginuser.accessToken).subscribe(
      (response) => {
        // console.log(response);

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success Reject Catering',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        // console.log(error);

        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Reject Catering",
          showConfirmButton: true,
          timer: 1500
        });
      }
    )
    let link = 'https://wa.me/' + this.splitnumber + '?text=Your%20request%20has%20been%20rejected!';
    window.open(link);
    document.getElementById('reject-catering')!.click();
    this.splitnumber = '';
  }

  acceptRequest(){
    // console.log(this.requestForm.value);

    this.userService.acceptRequest(this.requestForm.value, this.loginuser.accessToken).subscribe(
      (response) => {
        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success Reset Password',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Failed Reset Password',
          showConfirmButton: true,
          timer: 1500
        })
      }
    )
    let link = 'https://wa.me/' + this.splitnumber + '?text=Your%20request%20has%20been%20successfully%20received,%20please%20log%20in%20to%20the%20application!';
    window.open(link);
    document.getElementById('accept-catering-password')!.click();
    this.splitnumber = '';
  }

  rejectRequest(){
    // console.log(this.requestForm.value);

    this.userService.rejectRequest(this.requestForm.value, this.loginuser.accessToken).subscribe(
      (response) => {
        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success Reject Request',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Failed Reject Request',
          showConfirmButton: true,
          timer: 1500
        })
      }
    )
    let link = 'https://wa.me/' + this.splitnumber + '?text=Your%20request%20has%20been%20rejected!';
    window.open(link);
    document.getElementById('reject-catering-password')!.click();
    this.splitnumber = '';
  }

}
