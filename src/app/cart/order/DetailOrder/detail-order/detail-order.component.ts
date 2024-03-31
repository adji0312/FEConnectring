import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.css']
})
export class DetailOrderComponent implements OnInit {


  public loginuser: any = {};
  constructor(private _location: Location) { }

  ngOnInit(): void {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
    
  }


  goBack(){
    this._location.back();
  }
}
