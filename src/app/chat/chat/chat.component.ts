import { Component, OnInit } from '@angular/core';
import { Subscription, switchMap, timer } from 'rxjs';
import { Customer } from 'src/app/user/customer/customer.model';
import { CustomerService } from 'src/app/user/customer/customer.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public loginuser: any = {};
  searchText: any;
  customers!: Customer[];
  realTimeDataSubscription$!: Subscription;
  showResults = false;
  searchTerm = '';
  filteredItem: Customer[] = [];

  constructor(
    private customerService: CustomerService,
  ) { }

  ngOnInit(): void {

    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
    console.log(this.loginuser);
    this.getCustomers();
    
  }

  getCustomers(){
    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.customerService.getAllCustomer(this.loginuser.accessToken)))
      .subscribe(data => {        
        this.customers = data.sort();
        
      });
      // console.log(this.customers);
  }

  onSearch(){
    this.filteredItem = this.customers.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.phone.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.showResults = this.searchTerm.length > 0; // Show only if search term exists
  }

}
