import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  x!: number;

  constructor() { }

  ngOnInit(): void {

    this.x = 0;
    
  }


  clickUnpaid(){
    this.x = 0;
  }
  clickPaid(){
    this.x = 1
  }

}
