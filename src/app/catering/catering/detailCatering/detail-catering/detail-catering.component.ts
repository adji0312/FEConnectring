import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Chat } from 'src/app/chat/chat.model';
import { ChatService } from 'src/app/chat/chat.service';
import { Merchant } from 'src/app/user/merchant/merchant.model';
import { MerchantService } from 'src/app/user/merchant/merchant.service';
import { map, Subscription, switchMap, timer } from 'rxjs';
import { PackageService } from 'src/app/package/package.service';
import { Package } from 'src/app/package/package.model';
import { CustomerService } from 'src/app/user/customer/customer.service';
import { Customer } from 'src/app/user/customer/customer.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detail-catering',
  templateUrl: './detail-catering.component.html',
  styleUrls: ['./detail-catering.component.css']
})
export class DetailCateringComponent implements OnInit {


  viewCatering: Merchant = new Merchant;
  public loginuser: any = {};
  newChat!: FormGroup;
  findChat!: FormGroup;
  realTimeDataSubscription$!: Subscription;
  packages!: Package[];
  nullChat!: boolean;

  constructor(
    private router: Router,
    private merchantService: MerchantService,
    private packageService: PackageService,
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    private formBuilder : FormBuilder,
    private customerService: CustomerService,
    private http: HttpClient
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
    this.http = http;
  }

  ngOnInit(): void {

    this.viewCatering = this.merchantService.viewCatering;
    console.log(this.viewCatering);

    this.newChat = this.formBuilder.group({
      parent_id : [''],
      merchant_id : [''],
      // id_merchant : ['']
    });

    this.findChat = this.formBuilder.group({
      customerId : [''],
      merchantId : ['']
    });

    console.log(this.loginuser.userEntity);

    this.getPackage();
    this.getCustomerId();
    this.nullChat = false;
  }

  goOurPackage(){
    let i = document.getElementById('ourPackage');
    console.log(i);


  }

  getImageUrl(blob: Blob) {
    // console.log(blob);
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  getChat(){
    this.findChat.controls['merchantId'].setValue(this.viewCatering.id);
    this.chatService.findChat(this.findChat.value, this.loginuser.accessToken).subscribe(
      (data: Chat) => {
        console.log(data);
        if(data == null){

          this.newChat.controls['parent_id'].setValue(this.loginuser.userEntity.id);
          this.newChat.controls['merchant_id'].setValue(this.viewCatering.merchant_id);
          console.log(this.newChat.value);

          this.chatService.addChat(this.newChat.value, this.loginuser.accessToken).subscribe(
            (response: Chat) => {
              if(response){
                this.chatService.viewChat = response;
                this.router.navigate(['/detailChat']);
              }
            }
          )
        }else{
          this.chatService.viewChat = data;
          this.router.navigate(['/detailChat']);
        }
      }
    )

  }

  onChat(viewCatering: any){
    console.log(viewCatering);
    console.log(this.loginuser);

    // console.log(this.findChat.value);
    //find chat dlu klo ada return ke chat nya klo gk ada add chat
    this.getChat();
  }

  getPackage(){
    const initData = {
      merchant_username: this.viewCatering.parent.username
    };

    this.realTimeDataSubscription$ = timer(0, 1000)
    .pipe(switchMap(_ => this.packageService.getPackageByMerchant(initData, this.loginuser.accessToken))).subscribe(data =>{
      this.packages = data;
    });
  }

  getCustomerId(){
    const initData = {
      username: this.loginuser.userEntity.username
    };
    this.customerService.findCustomerByUsername(this.loginuser.userEntity.username, this.loginuser.accessToken).subscribe(data => {
      this.findChat.controls['customerId'].setValue(data.id);
      console.log(data);
    });

    // this.getChat();
  }

  onOpenDetailPackage(package_header: string){
    this.packageService.package_header = package_header;
    this.router.navigate(['/detailPackage']);
  }

}
