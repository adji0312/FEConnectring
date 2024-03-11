import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public loginuser: any = {};

  constructor(private http: HttpClient) {
    this.http = http;
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
   }

  ngOnInit(): void {

    console.log(this.loginuser);
    
    // this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
    // console.log(this.loginuser);
  }


  
  
}
