import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public loginuser: any = {};
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
    // console.log(this.loginuser);

  }

  logout(){
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

}
