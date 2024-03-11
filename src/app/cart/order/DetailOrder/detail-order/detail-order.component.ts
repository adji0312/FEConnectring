import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.css']
})
export class DetailOrderComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit(): void {
    
  }


  goBack(){
    this._location.back();
  }
}
