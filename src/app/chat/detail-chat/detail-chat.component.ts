import { Component, OnInit } from '@angular/core';
import { Merchant } from 'src/app/user/merchant/merchant.model';
import { MerchantService } from 'src/app/user/merchant/merchant.service';
import { Chat } from '../chat.model';
import { ChatService } from '../chat.service';
import { Location } from '@angular/common';
import { Customer } from 'src/app/user/customer/customer.model';
import { CustomerService } from 'src/app/user/customer/customer.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChatMessage } from '../chat-message.model';
import { Subscription, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-detail-chat',
  templateUrl: './detail-chat.component.html',
  styleUrls: ['./detail-chat.component.css']
})
export class DetailChatComponent implements OnInit {

  catering: Merchant = new Merchant();
  customer: Customer = new Customer();
  viewChat: Chat = new Chat();
  public loginuser: any = {};
  messageForm!: FormGroup;
  getChatId!: FormGroup;
  messages!: ChatMessage[];
  realTimeDataSubscription$!: Subscription;

  constructor(
    private merchantService: MerchantService,
    private customerService: CustomerService,
    private chatService: ChatService,
    private location: Location,
    private formBuilder: FormBuilder
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  ngOnInit(): void {

    this.messageForm = this.formBuilder.group({
      sender_id : [''],
      message : [''],
      merchant_id : [''],
      parent_id : ['']
    });

    this.getChatId = this.formBuilder.group({
      chat_id : ['']
    });

    this.catering = this.merchantService.viewCatering;
    this.viewChat = this.chatService.viewChat;
    this.customer = this.customerService.customer;

    // console.log(this.loginuser);

    // console.log(this.catering);
    // console.log(this.customer);

    // console.log(this.viewChat);



    // console.log(this.loginuser);

    // CUSTOMER
    if(this.loginuser.userEntity.flag == 1){
      this.messageForm.patchValue({
        sender_id : this.loginuser.userEntity.id,
        merchant_id : this.catering.merchant_id,
        parent_id : this.loginuser.userEntity.id
      });

      // console.log(this.messageForm.value);

    }
    // MERCHANT
    else if(this.loginuser.userEntity.flag == 2){
      this.messageForm.patchValue({
        sender_id : this.loginuser.userEntity.id,
        merchant_id : this.catering.merchant_id,
        parent_id : this.customer.parent.id
      });

      // console.log(this.messageForm.value);
    }

    this.getMessage();

  }

  goBack(){
    this.location.back();
  }

  private getMessage(){
    this.getChatId.patchValue({
      chat_id : this.viewChat.id
    })
    // this.chatService.getMessage(this.getChatId.value, this.loginuser.accessToken).subscribe(
    //   (data: ChatMessage) => {
    //     this.messages = data;

    //   }
    // )

    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.chatService.getMessage(this.getChatId.value, this.loginuser.accessToken)))
      .subscribe(data => {

        this.messages = data;

    });
  }

  onSubmitMessage(){
    // console.log(this.messageForm.value);
    this.chatService.addMessage(this.messageForm.value, this.loginuser.accessToken).subscribe(
      (data) => {
        // console.log(data);

      }
    )

    this.messageForm.patchValue({
      message: null
    })

  }

}
