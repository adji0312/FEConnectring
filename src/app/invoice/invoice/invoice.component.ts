import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  x!: number;
  public loginuser: any = {};

  constructor() { }

  ngOnInit(): void {

    this.x = 0;
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
    
  }


  clickUnpaid(){
    this.x = 0;
  }
  clickPaid(){
    this.x = 1
  }

}
