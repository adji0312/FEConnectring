import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/cart/order/order.service';
import { Transaction } from 'src/app/transaction/transaction.model';
import { TransactionService } from 'src/app/transaction/transaction.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  @ViewChild('closePayInvoice') closePayInvoice: ElementRef | undefined;
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('closeAcceptPayment') closeAcceptPayment: ElementRef | undefined;

  x!: number;
  public loginuser: any = {};

  invoiceForm!: FormGroup;

  cateringInvoice!: Transaction[];
  customerInvoice!: Transaction[];

  selectedTransaction!: Transaction;

  image_url!: any;

  payment_img: File | null = null;
  formData: FormData = new FormData();

  constructor(
    private formBuilder: FormBuilder,
    private transactionService: TransactionService,
    private router: Router,
    private orderService: OrderService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {

    this.x = 0;
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);

    this.invoiceForm = this.formBuilder.group({
      customer_username: this.loginuser.userEntity.username,
      menu: [''],
      transaction_id: ['']
    });

    if(this.loginuser.userEntity.flag == 1){
      this.clickUnpaid();
    }else if(this.loginuser.userEntity.flag == 2){
      this.clickUnpaidCatering();
    }


  }


  clickUnpaid(){
    this.x = 0;
    this.customerInvoice = [];

    this.invoiceForm.patchValue({
      menu: "Unpaid"
    });

    this.transactionService.getCustomerInvoice(this.invoiceForm.value, this.loginuser.accessToken).subscribe(data => {
      this.customerInvoice = data;
    });
  }

  clickPaid(){
    this.x = 1;
    this.customerInvoice = [];

    this.invoiceForm.patchValue({
      menu: "Paid"
    });

    this.transactionService.getCustomerInvoice(this.invoiceForm.value, this.loginuser.accessToken).subscribe(data => {
      this.customerInvoice = data;
    });

  }

  orderDetailPage(txn: Transaction){
    this.orderService.order = txn;
    this.orderService.menu = 'History';
    this.router.navigate(['orderDetail']);
  }

  selectPackage(txn: Transaction){
    this.selectedTransaction = txn;
  }

  onFileSelected(event: any) {
    this.payment_img = event.target.files[0];
  }

  uploadPaymentImage(){

    if(this.payment_img){
      this.formData.append("file", this.payment_img);
    }
    this.formData.append("transaction_id", this.selectedTransaction.transaction_id);

    // console.log(this.payment_img);
    // console.log(this.formData);

    this.transactionService.uploadPaymentImage(this.formData, this.loginuser.accessToken).subscribe(
      (response: Transaction) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Success Upload Image',
            showConfirmButton: true,
            timer: 1500
          })
        },
        (error: HttpErrorResponse) => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: "Failed Upload Image",
            showConfirmButton: true,
            timer: 1500
          })
      });

      this.closePayInvoiceModal();
      this.clickUnpaid();
  }

  selectTransactionImage(txn: Transaction){
    this.selectedTransaction = txn;
    this.image_url = 'data:image/jpeg;base64,' + txn.payment_img;
  }

  loadImage(){
    if(!this.image_url){
      return null;
    }
    return this.sanitizer.bypassSecurityTrustUrl(this.image_url);
  }



  clickUnpaidCatering(){
    this.x = 0;
    this.cateringInvoice = [];

    this.invoiceForm.patchValue({
      menu: "Unpaid"
    });

    this.transactionService.getCateringInvoice(this.invoiceForm.value, this.loginuser.accessToken).subscribe(data => {
      this.cateringInvoice = data;
    });
  }

  clickPaidCatering(){
    this.x = 1
    this.cateringInvoice = [];

    this.invoiceForm.patchValue({
      menu: "Paid"
    });

    this.transactionService.getCateringInvoice(this.invoiceForm.value, this.loginuser.accessToken).subscribe(data => {
      this.cateringInvoice = data;
    });
  }

  resetSelectedFile() {
    this.payment_img = null;
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  acceptPayment(){

    this.invoiceForm.patchValue({
      transaction_id: this.selectedTransaction.transaction_id
    });

    // console.log(this.invoiceForm.value);

    this.transactionService.acceptPayment(this.invoiceForm.value, this.loginuser.accessToken).subscribe(
      (response: any) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Confirm Payment" ,
          showConfirmButton: true,
          timer: 1500
        });
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Confirm Payment",
          showConfirmButton: true,
          timer: 1500
        })


    });

    this.closeAcceptPaymentModal();
    this.clickPaidCatering();
  }


  closePayInvoiceModal(){
    if(this.closePayInvoice){
      this.closePayInvoice.nativeElement.click();
      this.resetSelectedFile();
    }
  }

  closeAcceptPaymentModal(){
    if(this.closeAcceptPayment){
      this.closeAcceptPayment.nativeElement.click();
    }
  }
}
