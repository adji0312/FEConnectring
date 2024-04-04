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
import { DomSanitizer } from '@angular/platform-browser';

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
  addChat!: FormGroup;
  chatExists!: boolean;
  // viewCatering: Merchant = new Merchant;

  constructor(
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private merchantService: MerchantService,
    private chatService: ChatService,
    private router: Router,
    private sanitizer: DomSanitizer
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
    this.addChat = this.formBuilder.group({
      parent_id: [''],
      merchant_id: [''],
    });



    if(this.loginuser.userEntity.flag == 1){
      this.findCustomer();
    }
    else if(this.loginuser.userEntity.flag == 2){
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

  onChatCustomer(merchant: Merchant){

    this.checkChat.patchValue({
      merchantId : merchant.id,
      // merchantId : 
    })
    console.log(this.checkChat.value);

    this.chatService.findChat(this.checkChat.value, this.loginuser.accessToken).subscribe(
      (data: Chat) => {
        if(data){
          console.log(data);
          
          this.chatService.viewChat = data;
          this.merchantService.viewCatering = merchant;
          // this.customerService.customer = customer;
          this.router.navigate(['/detailChat']);
        }
      }
    )
  }
  
  onChatMerchant(customer: Customer){

    this.checkChat.patchValue({
      customerId : customer.id,
      // merchantId : 
    })
    console.log(this.checkChat.value);

    if(this.loginuser.userEntity.flag == 2){
      this.merchantService.getMerchant(this.loginuser.userEntity.username, this.loginuser.accessToken).subscribe(
        (data) => {
          this.merchantService.viewCatering = data;
          this.addChat.controls['merchant_id'].setValue(data.merchant_id);
        }
      )
    }

    if(this.loginuser.userEntity.flag == 2){
      this.chatService.findChat(this.checkChat.value, this.loginuser.accessToken).subscribe(
        (data: Chat) => {
          if(data){
            this.chatService.viewChat = data;
            this.customerService.customer = customer;
            this.router.navigate(['/detailChat']);
          }
          else{
            this.addChat.controls['parent_id'].setValue(customer.parent.id);
            
            console.log(this.addChat.value);
            
            this.chatService.addChat(this.addChat.value, this.loginuser.accessToken).subscribe(
              (response: Chat) => {
                console.log(response);
                this.chatService.viewChat = response;
                this.customerService.customer = customer;
                this.router.navigate(['/detailChat']);
              }
            )
          }
          
        }
      )
    }
    else if(this.loginuser.userEntity.flag == 1){
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

  findCustomer(){
    this.customerService.findCustomerByUsername(this.loginuser.userEntity.username, this.loginuser.accessToken).subscribe(
      (response) => {
        this.checkChat.patchValue({
          customerId : response.id
        });
        
      }
    )
  }

  getCustomerMerchantChat(){
    if(this.loginuser.userEntity.flag == 1){
      this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.customerService.findCustomerByUsername(this.loginuser.userEntity.username, this.loginuser.accessToken)))
      .subscribe(data => {
        this.getChat.patchValue({
          customerId : data.id
        });

        // console.log(this.checkChat.value);
        
        this.realTimeDataSubscription$ = timer(0, 1000)
        .pipe(switchMap(_ => this.chatService.getCustomerChat(this.checkChat.value, this.loginuser.accessToken)))
        .subscribe(data => {
          this.chatData = data;
        });
      });
    }
    else if(this.loginuser.userEntity.flag == 2){
      this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.merchantService.getMerchant(this.loginuser.userEntity.username, this.loginuser.accessToken)))
      .subscribe(data => {
        this.getChat.patchValue({
          merchantId : data.id
        });

        this.realTimeDataSubscription$ = timer(0, 1000)
        .pipe(switchMap(_ => this.chatService.getMerchantChat(this.checkChat.value, this.loginuser.accessToken)))
        .subscribe(data => {
          this.chatData = data;

        });
      });
      
    }
  }

  getImageUrl(blob: Blob) {
    // console.log(blob);
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

}
