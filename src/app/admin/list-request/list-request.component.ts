import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, switchMap, timer } from 'rxjs';
import { Merchant } from 'src/app/user/merchant/merchant.model';
import { MerchantService } from 'src/app/user/merchant/merchant.service';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';

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

  private loadData(){
    this.getMerchants();
  }

  constructor(
    private merchantService: MerchantService,
    private sanitizer: DomSanitizer,
    private userService: UserService
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  ngOnInit(): void {
    this.x = 0;
    this.loadData();
  }

  private getMerchants(){
    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.merchantService.getAllMerchant(this.loginuser.accessToken)))
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
        console.log(data);
        this.users = data.sort();
      })
  }

  getImageUrl(blob: Blob) {
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  onOpenModal(merchant: Merchant, mode: string){
    console.log(merchant);
    // console.log(mode);

    if(mode === 'delete'){
      // this.deleteMerchant = merchant;
      // console.log(this.deleteMerchant.parent.username);
    }else if(mode === 'reset'){
      // this.resetPasswordMerchant = merchant;
      // console.log(this.resetPasswordMerchant);
      
    }
    
  }

  clickCatering(){
    this.x = 0;
    // this.orderList = [];
    // this.orderService.menu = "Order";

    // this.orderForm.patchValue({
    //   menu: "Order"
    // });

    // console.log(this.orderForm.value);

    // this.transactionService.getCustomerOrder(this.orderForm.value, this.loginuser.accessToken).subscribe(data => {
    //   this.orderList = data;
    //   // console.log(data);
    // });
    this.loadData();
  }

  clickCustomer(){
    this.x = 1;
    // this.orderList = [];
    // this.orderService.menu = "Order";

    // this.orderForm.patchValue({
    //   menu: "Order"
    // });

    // console.log(this.orderForm.value);

    // this.transactionService.getCustomerOrder(this.orderForm.value, this.loginuser.accessToken).subscribe(data => {
    //   this.orderList = data;
    //   // console.log(data);
    // });
    this.getUsers();
  }

}
