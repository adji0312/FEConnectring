import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  public loginuser: any = {};
  x!: number;

  constructor() { }

  ngOnInit(): void {

    this.x = 0;
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
    
  }


  clickOngoing(){
    this.x = 0;
  }
  clickHistory(){
    this.x = 1
  }
}
