import { Component, OnInit } from '@angular/core';
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

  public loginuser: any = {};

  reportForm!: FormGroup;

  transactionRpt!: TransactionReport[];

  constructor(
    private transactionService: TransactionService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);

    this.reportForm = this.formBuilder.group({
      merchant_name: this.loginuser.userEntity.username
    });

    this.transactionService.getMerchantReportByMonth(this.reportForm.value, this.loginuser.accessToken).subscribe(data => {
      this.transactionRpt = data;
    });
  }



}
