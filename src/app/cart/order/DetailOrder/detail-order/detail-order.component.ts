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
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.css']
})
export class DetailOrderComponent implements OnInit {

  @ViewChild('closeNotes') closeNotes: ElementRef | undefined;
  @ViewChild('closeCancel') closeCancel: ElementRef | undefined;
  @ViewChild('closeFilterDate') closeFilterDate: ElementRef | undefined;
  @ViewChild('closeCheckAll') closeCheckAll: ElementRef | undefined;

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
    private transactionService: TransactionService,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit(): void {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);

    this.detailOrderForm = this.formBuilder.group({
      notes: [''],
      flag_check: [''],
      flag_cancel: [''],
      transaction_id: [''],
      package_id: [''],
      customer_username: [''],
      menu: [''],
    });

    this.orderForm = this.formBuilder.group({
      order_date: [''],
      group_id: [''],
      customer_username: [''],
      transaction_id: ['']
    })

    if(this.loginuser.userEntity.flag == 1){

      this.selectedOrder = this.orderService.order;
      this.packageList = this.orderService.order.transactionDetailDtoList;

      this.detailOrderForm.patchValue({
        transaction_id: this.selectedOrder.transaction_id,
        customer_username: this.loginuser.userEntity.username,
        menu: this.orderService.menu,
      });

      this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.transactionService.getCustomerOrderByTransaction(this.detailOrderForm.value, this.loginuser.accessToken))).subscribe(data => {

        this.selectedOrder = data[0];
        this.packageList = data[0].transactionDetailDtoList;
      });
    }

    if(this.loginuser.userEntity.flag == 2){

        this.selectedGroup = this.orderService.group;

        this.orderForm.patchValue({
          order_date: new Date(),
          group_id: this.selectedGroup.group_id,
          customer_username: null
        });

        // console.log(this.orderForm.value);

        this.initData();
    }

  }

  initData(){
    this.transactionService.getCateringOrderDetail(this.orderForm.value, this.loginuser.accessToken).subscribe(data => {
      this.orderDetailList = data;

      // console.log(data);

      if(this.orderDetailList[0].customer_username == null){
        this.orderIsEmpty = true;
      }else{
        this.orderIsEmpty = false;
      }
    });
  }


  goBack(){
    this._location.back();
  }

  checkStatus(){
    if(this.selectedOrder && this.selectedOrder.payment_status == 'ACC' && this.orderService.menu != 'History' ){
      return true;
    }

    return false;
  }

  updateOrderDetail(selectedPackage: Package){
    this.detailOrderForm.patchValue({
      package_id: selectedPackage,
      flag_cancel: false
    });

    // console.log(this.detailOrderForm);
  }

  getImageUrl(blob: Blob) {
    // console.log(blob);
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  onUpdateOrderDetail(mode: string){

    var status: string;

    if (mode == 'cancel'){
      this.detailOrderForm.patchValue({
        flag_cancel: true
      });
      status = 'Cancel Order';
    }else if(mode == 'notes'){
      status = 'Add Note'
    }

    // console.log(this.detailOrderForm.value);

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

    this.detailOrderForm.get('notes')?.setValue("");
    this.detailOrderForm.get('flag_cancel')?.setValue("");

    if(mode == 'notes'){
      this.closeNotesModal();
    }else if (mode == 'cancel'){
      this.closeCancelModal();
    }
  }

  searchDate(){
    this.initData();
    this.closeFilterDateModal();
  }

  checkButton(check: Boolean){

    if(check == null){
      return true;
    }

    return false;
  }

  updateOrderCheck(order: TransactionDetail){

    this.orderForm.patchValue({
      customer_username: order.customer_username,
      transaction_id: order.transaction_id
    });


    this.transactionService.updateOrderCheck(this.orderForm.value, this.loginuser.accessToken).subscribe(data => {
      this.initData();
    });
  }

  updateAll(){

    // console.log(this.orderForm.value);

    this.transactionService.updateOrderCheck(this.orderForm.value, this.loginuser.accessToken).subscribe(data => {
      this.initData();
      this.closeCheckAllModal();
    });
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

  closeCheckAllModal(){
    if(this.closeCheckAll){
      this.closeCheckAll.nativeElement.click();
    }
  }


}
