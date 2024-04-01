import { Component, OnInit } from '@angular/core';
import { Merchant } from 'src/app/user/merchant/merchant.model';
import { MerchantService } from 'src/app/user/merchant/merchant.service';
import { Chat } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-detail-chat',
  templateUrl: './detail-chat.component.html',
  styleUrls: ['./detail-chat.component.css']
})
export class DetailChatComponent implements OnInit {

  catering: Merchant = new Merchant();
  viewChat: Chat = new Chat();
  public loginuser: any = {};

  constructor(
    private merchantService: MerchantService,
    private chatService: ChatService
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  ngOnInit(): void {

    this.catering = this.merchantService.viewCatering;
    this.viewChat = this.chatService.viewChat;

    console.log(this.catering);

    console.log(this.viewChat);
    
    

    console.log(this.loginuser);
    
  }

}
