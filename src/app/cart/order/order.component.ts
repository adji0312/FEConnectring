import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {


  x!: number;

  constructor() { }

  ngOnInit(): void {

    this.x = 0;
    
  }


  clickOngoing(){
    this.x = 0;
  }
  clickHistory(){
    this.x = 1
  }
}
