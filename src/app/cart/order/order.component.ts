import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, switchMap, timer } from 'rxjs';
import { Package } from 'src/app/package/package.model';
import { Transaction } from 'src/app/transaction/transaction.model';
import { TransactionService } from 'src/app/transaction/transaction.service';
import Swal from 'sweetalert2';
import { OrderService } from './order.service';
import { Group } from 'src/app/group/group.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  @ViewChild('closeAcceptOrder') closeAcceptOrder: ElementRef | undefined;
  @ViewChild('closeRejectOrder') closeRejectOrder: ElementRef | undefined;

  public loginuser: any = {};
  x!: number;

  realTimeDataSubscription$!: Subscription;

  orderForm!: FormGroup;

  orderList!: Transaction[];

  cateringOrder!: any[];

  constructor(
    private transactionService: TransactionService,
    private formBuilder : FormBuilder,
    private router: Router,
    private orderService: OrderService
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
        menu: "Incoming",
        payment_status: [''],
        group_id: ['']
      });
      this.clickIncoming();
    }
  }

  clickOrder(){
    this.x = 0;
    this.orderList = [];

    this.orderForm.patchValue({
      menu: "Order"
    });

    console.log(this.orderForm.value);

    this.transactionService.getCustomerOrder(this.orderForm.value, this.loginuser.accessToken).subscribe(data => {
      this.orderList = data;
      // console.log(data);
    });
  }

  orderDetailPage(order: Transaction){
    this.orderService.order = order;
    this.router.navigate(['orderDetail']);
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

  clickIncoming(){
    this.x = 0;
    this.cateringOrder = [];

    this.orderForm.patchValue({
      menu: "Incoming"
    });


    this.transactionService.getCateringOrder(this.orderForm.value, this.loginuser.accessToken).subscribe(data => {
      this.cateringOrder = data;
      // console.log(this.cateringOrder);
    });
  }

  clickOngoing(){
    this.x = 1
    this.cateringOrder = [];

    this.orderForm.patchValue({
      menu: "Ongoing"
    });

    this.transactionService.getCateringOrder(this.orderForm.value, this.loginuser.accessToken).subscribe(data => {
      this.cateringOrder = data;
      // console.log(this.cateringOrder);
    });
  }

  clickDone(){
    this.x = 2
    this.cateringOrder = [];

    this.orderForm.patchValue({
      menu: "Done"
    });

    this.transactionService.getCateringOrder(this.orderForm.value, this.loginuser.accessToken).subscribe(data => {
      this.cateringOrder = data;
      // console.log(this.cateringOrder);
    });
  }

  updateStatus(group_id: string){
    this.orderForm.patchValue({
      group_id: group_id
    });
  }

  onUpdateStatus(status: string){
    var txn_status = "";
    if(status == "ACC"){
      this.orderForm.patchValue({
        payment_status: "ACC",
      });
      txn_status = "Accept";
    }else if(status == "RJCT"){
      this.orderForm.patchValue({
        payment_status: "RJCT",
      });
      txn_status = "Reject";
    }

    this.transactionService.updateTransactionStatus(this.orderForm.value, this.loginuser.accessToken).subscribe(
      (response: any) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success " + txn_status  +  " Order",
          showConfirmButton: true,
          timer: 1500
        });

        this.clickIncoming();
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed " + txn_status + " Order",
          showConfirmButton: true,
          timer: 1500
        })
    });

    if(status == "ACC"){
      this.closeAcceptOrderModal();
    }else if(status == "RJCT"){
      this.closeRejectOrderModal();
    }
  }

  openOrderDetail(selectedGroup: Group){
    this.orderService.group = selectedGroup;
    this.router.navigate(['orderDetail']);
  }

  closeAcceptOrderModal(){
    if(this.closeAcceptOrder){
      this.closeAcceptOrder.nativeElement.click();
    }
  }

  closeRejectOrderModal(){
    if(this.closeRejectOrder){
      this.closeRejectOrder.nativeElement.click();
    }
  }
}
