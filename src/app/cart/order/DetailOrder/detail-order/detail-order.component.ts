import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../order.service';
import { Transaction, TransactionDetail } from 'src/app/transaction/transaction.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GroupedObservable, Subscription, switchMap, timer } from 'rxjs';
import { TransactionService } from 'src/app/transaction/transaction.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Package } from 'src/app/package/package.model';
import { Group } from 'src/app/group/group.model';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.css']
})
export class DetailOrderComponent implements OnInit {

  @ViewChild('closeNotes') closeNotes: ElementRef | undefined;
  @ViewChild('closeCancel') closeCancel: ElementRef | undefined;
  @ViewChild('closeFilterDate') closeFilterDate: ElementRef | undefined;

  selectedOrder!: Transaction;
  selectedGroup!: Group;

  packageList!: any[];
  orderDetailList!: TransactionDetail[];
  orderIsEmpty!: Boolean;

  detailOrderForm!: FormGroup;
  orderForm!: FormGroup;

  public loginuser: any = {};

  realTimeDataSubscription$!: Subscription;

  constructor(
    private _location: Location,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private transactionService: TransactionService
    ) { }

  ngOnInit(): void {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);

    this.detailOrderForm = this.formBuilder.group({
      notes: [''],
      flag_check: [''],
      flag_confirm: [''],
      transaction_id: [''],
      package_id: [''],
      customer_username: [''],
      menu: [''],
    });

    if(this.loginuser.userEntity.flag == 1){

      this.selectedOrder = this.orderService.order;
      this.packageList = this.selectedOrder.transactionDetailDtoList;

      this.detailOrderForm.patchValue({
        transaction_id: this.selectedOrder.transaction_id,
        customer_username: this.loginuser.userEntity.username,
        menu: "Order",
      });


      this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.transactionService.getCustomerOrder(this.detailOrderForm.value, this.loginuser.accessToken))).subscribe(data => {
        this.selectedOrder = data[0];
        this.packageList = this.selectedOrder.transactionDetailDtoList;
      });
    }

    if(this.loginuser.userEntity.flag == 2){

        this.selectedGroup = this.orderService.group;

        this.orderForm = this.formBuilder.group({
          order_date: null,
          group_id: this.selectedGroup.group_id
        });

        // console.log(this.orderForm.value);

        this.transactionService.getCateringOrderDetail(this.orderForm.value, this.loginuser.accessToken).subscribe(data => {
          this.orderDetailList = data;
        });


    }

  }


  goBack(){
    this._location.back();
  }

  checkStatus(){
    if(this.selectedOrder.payment_status == 'ACC'){
      return true;
    }

    return false;
  }

  updateOrderDetail(selectedPackage: Package){
    this.detailOrderForm.patchValue({
      package_id: selectedPackage,
      flag_confirm: false
    });

    console.log(this.detailOrderForm);
  }

  onUpdateOrderDetail(mode: string){

    var status: string;

    if (mode == 'cancel'){
      this.detailOrderForm.patchValue({
        flag_confirm: true
      });
      status = 'Cancel Order';
    }else if(mode == 'notes'){
      status = 'Add Note'
    }

    console.log(this.detailOrderForm.value);

    this.transactionService.updateCustomerOrderDetail(this.detailOrderForm.value, this.loginuser.accessToken).subscribe(
        (response: any) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success " + status,
          showConfirmButton: true,
          timer: 1500
        })
        },
        (error: HttpErrorResponse) => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: "Failed " + status,
            showConfirmButton: true,
            timer: 1500
          })
        }
    );

    // this.detailOrderForm.get('package_id')?.reset();
    this.detailOrderForm.get('notes')?.setValue("");
    this.detailOrderForm.get('flag_confirm')?.setValue("");

    if(mode == 'notes'){
      this.closeNotesModal();
    }else if (mode == 'cancel'){
      this.closeCancelModal();
    }
  }

  searchDate(){
    this.transactionService.getCateringOrderDetail(this.orderForm.value, this.loginuser.accessToken).subscribe(data => {
      // console.log(data);
      this.orderDetailList = data;
      if(this.orderDetailList[0].customer_username == null){
        this.orderIsEmpty = true;
      }else{
        this.orderIsEmpty = false;
      }
    });

    this.closeFilterDateModal();
  }

  checkButton(check: Boolean){

    if(check == null){
      return true;
    }

    return false;
  }

  closeNotesModal(){
    if(this.closeNotes){
      this.closeNotes.nativeElement.click();
    }
  }

  closeCancelModal(){
    if(this.closeCancel){
      this.closeCancel.nativeElement.click();
    }
  }

  closeFilterDateModal(){
    if(this.closeFilterDate){
      this.closeFilterDate.nativeElement.click();
    }
  }


}
