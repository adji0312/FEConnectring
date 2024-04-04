import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, switchMap, timer } from 'rxjs';
import { Customer } from 'src/app/user/customer/customer.model';
import { CustomerService } from 'src/app/user/customer/customer.service';
import { MerchantService } from 'src/app/user/merchant/merchant.service';
import { ChatService } from '../chat.service';
import { Chat } from '../chat.model';
import { Router } from '@angular/router';
import { Merchant } from 'src/app/user/merchant/merchant.model';

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
  chatData!: Chat[];
  checkChat!: FormGroup;
  getChat!: FormGroup;
  chatExists!: boolean;
  viewCatering: Merchant = new Merchant;

  constructor(
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private merchantService: MerchantService,
    private chatService: ChatService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.getCustomers();

    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
    this.checkChat = this.formBuilder.group({
      customerId: [''],
      merchantId: [''],
    });
    this.getChat = this.formBuilder.group({
      customerId: [''],
      merchantId: [''],
    });



    if(this.loginuser.userEntity.flag == 2){
      this.findMerchant();
    }
    
    this.chatExists = false;

    // this.btn.addE
    this.getCustomerMerchantChat();
    
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

  onChat(customer: Customer){

    this.checkChat.patchValue({
      customerId : customer.id,
      // merchantId : 
    })
    console.log(this.checkChat.value);

    if(this.loginuser.userEntity.flag == 2){
      this.merchantService.getMerchant(this.loginuser.userEntity.username, this.loginuser.accessToken).subscribe(
        (data) => {
          this.merchantService.viewCatering = data;
        }
      )
    }

    this.chatService.findChat(this.checkChat.value, this.loginuser.accessToken).subscribe(
      (data: Chat) => {
        if(data){
          this.chatService.viewChat = data;
          this.customerService.customer = customer;
          this.router.navigate(['/detailChat']);
        }
      }
    )
    
  }

  findMerchant(){
    this.merchantService.getMerchant(this.loginuser.userEntity.username, this.loginuser.accessToken).subscribe(
      (response) => {
        this.checkChat.patchValue({
          merchantId : response.id
        });
        
      }
    )
  }

  getCustomerMerchantChat(){
    if(this.loginuser.userEntity.flag == 1){
      
    }
    else if(this.loginuser.userEntity.flag == 2){
      this.merchantService.getMerchant(this.loginuser.userEntity.username, this.loginuser.accessToken).subscribe(
        async (response) => {
          if(response){
            this.getChat.patchValue({
              merchantId : response.id
            });
            console.log(this.getChat.value);
            this.chatService.getMerchantChat(this.checkChat.value, this.loginuser.accessToken).subscribe(
              (data: Chat) => {
                
                console.log(this.chatData);
                
                
                console.log(data);
                
              }
            )
          }
          
        }
      )

      
      // this.getChat.patchValue({
      //   merchantId : 
      // });

      // console.log(this.checkChat.value);
      
    }
  }

}
