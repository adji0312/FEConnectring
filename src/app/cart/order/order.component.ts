import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, switchMap, timer } from 'rxjs';
import { Transaction } from 'src/app/transaction/transaction.model';
import { TransactionService } from 'src/app/transaction/transaction.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  public loginuser: any = {};
  x!: number;

  realTimeDataSubscription$!: Subscription;

  orderForm!: FormGroup;

  orderList!: Transaction[];

  cateringOrder!: any[];

  constructor(
    private transactionService: TransactionService,
    private formBuilder : FormBuilder,
  ) { }

  ngOnInit(): void {

    this.x = 0;
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);

    if(this.loginuser.userEntity.flag == 1){
      this.orderForm = this.formBuilder.group({
        customer_username: this.loginuser.userEntity.username,
        menu: "Order"
      });
      this.clickOrder();
    }else if(this.loginuser.userEntity.flag == 2){
      this.orderForm = this.formBuilder.group({
        customer_username: this.loginuser.userEntity.username,
        menu: "Order"
      });
      this.clickOngoing();
    }
  }

  clickOrder(){
    this.x = 0;
    this.orderList = [];

    this.orderForm.patchValue({
      menu: "Order"
    });

    this.transactionService.getCustomerOrder(this.orderForm.value, this.loginuser.accessToken).subscribe(data => {
      this.orderList = data;
      // console.log(data);
    });
  }
  clickOrderHistory(){
    this.x = 1
    this.orderList = [];

    this.orderForm.patchValue({
      menu: "History"
    });

    this.transactionService.getCustomerOrder(this.orderForm.value, this.loginuser.accessToken).subscribe(data => {
      this.orderList = data;
      // console.log(data);
    });

  }

  groupByPackageHeader(data: any[]): any[] {
    return data.reduce((acc, item) => {
      const packageHeader = item.package.package_header;
      if (!acc[packageHeader]) {
        acc[packageHeader] = [];
      }
      acc[packageHeader].push(item);
      return acc;
    }, {});
  }

  clickOngoing(){
    this.x = 0;

    this.transactionService.getCateringOrder(this.orderForm.value, this.loginuser.accessToken).subscribe(data => {
      console.log(data);
      // this.cateringOrder = this.groupByPackageHeader(data);
      this.cateringOrder = data;
      // console.log(data);
    });
  }
  clickHistory(){
    this.x = 1
  }

  clickDone(){
    this.x = 2
  }
}
