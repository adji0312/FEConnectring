import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Package } from 'src/app/package/package.model';
import { Observable, Subscription, finalize, switchMap, timer } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PackageService } from 'src/app/package/package.service';
import { TransactionService } from 'src/app/transaction/transaction.service';
import { Transaction } from 'src/app/transaction/transaction.model';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-package',
  templateUrl: './detail-package.component.html',
  styleUrls: ['./detail-package.component.css']
})
export class DetailPackageComponent implements OnInit {

  @ViewChild('closeOrder') closeOrder: ElementRef | undefined;

  public loginuser: any = {};
  packageList!: Package[];
  realTimeDataSubscription$!: Subscription;

  orderForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private packageService: PackageService,
    private transactionService: TransactionService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  ngOnInit(): void {

    this.orderForm = this.formBuilder.group({
      order_date: [],
      customer_username: [],
      merchant_id: [],
      package_header: []
    })

    const newFormGroup = this.createPackageFormGroup();

    newFormGroup.patchValue({
      package_header: this.packageService.package_header
    });

    this.realTimeDataSubscription$ = timer(0, 1000)
    .pipe(switchMap(_ => this.packageService.getPackageByPackageHeader(newFormGroup.value, this.loginuser.accessToken))).subscribe(data => {
      this.packageList = data;
      // console.log(this.packageList);
    });


  }

  createPackageFormGroup(): FormGroup {
    return this.formBuilder.group({
      start_date: [''],
      end_date: [''],
      value_date: [''],
      price: [''],
      food_img: [''],
      merchant_username: [''],
      package_header: ['']
    });
  }

  getFoodNames(pack: Package): string {

    pack.packageItemDtoList.forEach(packageItem => { // Accessing 'food_name' within 'food' object
    });

    // return "true";
    return pack.packageItemDtoList.map(packageItem => packageItem.food_name).join(', ');
  }

  getImageUrl(blob: Blob) {
    // console.log(blob);
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  createOrder(){

    this.orderForm.patchValue({
      order_date: new Date(),
      customer_username: this.loginuser.userEntity.username,
      merchant_id: this.packageList[0].merchant_id,
      package_header: this.packageService.package_header
    });

    this.transactionService.createTransaction(this.orderForm.value, this.loginuser.accessToken).subscribe(
      (response: Transaction) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Add Order",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Add Order",
          showConfirmButton: true,
          timer: 1500
        })
      }
    );

    this.router.navigate(["order"]);
    this.closeOrderModal();
  }

  closeOrderModal(){
    if(this.closeOrder){
      this.closeOrder.nativeElement.click();
    }
  }

}
