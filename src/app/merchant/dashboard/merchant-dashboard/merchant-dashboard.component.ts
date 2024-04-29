import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {MatDatepicker} from '@angular/material/datepicker';
import { TransactionReport } from 'src/app/transaction/transaction.model';
import { TransactionService } from 'src/app/transaction/transaction.service';

@Component({
  selector: 'app-merchant-dashboard',
  templateUrl: './merchant-dashboard.component.html',
  styleUrls: ['./merchant-dashboard.component.css']
})
export class MerchantDashboardComponent implements OnInit {

  @ViewChild('closeFilterBtn') closeFilterBtn: ElementRef | undefined;

  public loginuser: any = {};

  reportForm!: FormGroup;

  transactionRpt!: TransactionReport[];
  yearList: string[] = [];

  constructor(
    private transactionService: TransactionService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);

    this.reportForm = this.formBuilder.group({
      merchant_name: this.loginuser.userEntity.username,
      order_date: new FormControl()
    });

    this.transactionService.getMerchantReportByMonth(this.reportForm.value, this.loginuser.accessToken).subscribe(data => {
      this.transactionRpt = data;
    });


    this.getLast10Years();
  }


  getLast10Years(): void {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    for (let i = currentYear; i >= currentYear - 10; i--) {
      if (i === currentYear) {
        this.yearList.push(new Date().toISOString());
        this.reportForm.patchValue({
          order_date: new Date().toISOString()
        });
      } else {
        this.yearList.push(new Date(i, 11, 31).toISOString());
      }
    }
  }


  filterYear(){
    this.transactionService.getMerchantReportByMonth(this.reportForm.value, this.loginuser.accessToken).subscribe(data => {
      this.transactionRpt = data;
    });

    this.closeFilterModal();
  }

  closeFilterModal(){
    if(this.closeFilterBtn){
      this.closeFilterBtn.nativeElement.click();
    }
  }

}
