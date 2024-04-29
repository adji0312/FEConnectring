import { Component, OnInit } from '@angular/core';
import { AdminChatService } from '../admin-chat.service';
import { Subscription, switchMap, timer } from 'rxjs';
import { AdminChat } from './admin-chat.model';
import { ChatService } from 'src/app/chat/chat.service';
import { Chat } from 'src/app/chat/chat.model';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Merchant } from 'src/app/user/merchant/merchant.model';
import { Customer } from 'src/app/user/customer/customer.model';
import { ChatMessage } from 'src/app/chat/chat-message.model';

@Component({
  selector: 'app-list-chat',
  templateUrl: './list-chat.component.html',
  styleUrls: ['./list-chat.component.css']
})
export class ListChatComponent implements OnInit {

  public loginuser: any = {};
  realTimeDataSubscription$!: Subscription;
  chat!: Chat[];
  catering: Merchant = new Merchant();
  customer: Customer = new Customer();
  getChatForm!: FormGroup;
  messages!: ChatMessage[];
  messageForm!: FormGroup;
  page: number = 1;
  tableSize: number = 10;

  constructor(
    private chatService: ChatService,
    private sanitizer: DomSanitizer,
    private formBuilder : FormBuilder

  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  private loadData(){
    this.getUserChat();
  }

  ngOnInit(): void {

    this.loadData();
    this.getChatForm = this.formBuilder.group({
      chat_id: ['']
    });
    this.messageForm = this.formBuilder.group({
      sender_id : [''],
      message : [''],
      user_id : ['']
    });
  }

  getUserChat(){
    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.chatService.getAdminChat(this.loginuser.accessToken)))
      .subscribe(data => {

        this.chat = data.sort();
        // console.log(this.chat);
    });
  }

  getImageUrl(blob: Blob) {
    // console.log(blob);
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  onClickChat(chat: Chat){
    if(chat.customer){
      this.customer = chat.customer;
      this.messageForm.patchValue({
        sender_id : this.loginuser.userEntity.id,
        user_id : this.customer.parent.id
      });
    }else{
      this.catering = chat.merchant
      this.messageForm.patchValue({
        sender_id : this.loginuser.userEntity.id,
        user_id : this.catering.parent.id
      });
    }

    this.getChatForm.patchValue({
      chat_id : chat.id
    });
    // console.log(chat);
    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.chatService.getMessage(this.getChatForm.value, this.loginuser.accessToken)))
      .subscribe(data => {

        this.messages = data;
    });
  }

  onSubmitMessage(){
    // this.messageForm.patchValue({
    //   sender_id : this.loginuser.userEntity.id,
    //   user_id : this.loginuser.userEntity.id
    // });
    // console.log(this.messageForm.value);
    this.chatService.addMessageAdmin(this.messageForm.value, this.loginuser.accessToken).subscribe(
      (data) => {
        // console.log(data);

      }
    )

    this.messageForm.patchValue({
      message: null
    })

  }

  onTableDataChange(event: any){
    this.page = event;
    // this.getFood();
  }
}
