import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../order.service';
import { Transaction } from 'src/app/transaction/transaction.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, switchMap, timer } from 'rxjs';
import { TransactionService } from 'src/app/transaction/transaction.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Package } from 'src/app/package/package.model';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.css']
})
export class DetailOrderComponent implements OnInit {

  @ViewChild('closeNotes') closeNotes: ElementRef | undefined;
  @ViewChild('closeCancel') closeCancel: ElementRef | undefined;

  selectedOrder!: Transaction;
  packageList!: any[];

  detailOrderForm!: FormGroup;

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
    this.selectedOrder = this.orderService.order;
    this.packageList = this.selectedOrder.transactionDetailDtoList;

    this.detailOrderForm = this.formBuilder.group({
      notes: [''],
      flag_check: [''],
      flag_confirm: [''],
      transaction_id: this.selectedOrder.transaction_id,
      package_id: [''],
      customer_username: this.loginuser.userEntity.username,
      menu: "Order",
    });


    this.realTimeDataSubscription$ = timer(0, 1000)
    .pipe(switchMap(_ => this.transactionService.getCustomerOrder(this.detailOrderForm.value, this.loginuser.accessToken))).subscribe(data => {
      this.selectedOrder = data[0];
      this.packageList = this.selectedOrder.transactionDetailDtoList;
    });

    // console.log(this.detailOrderForm.value);
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


}
