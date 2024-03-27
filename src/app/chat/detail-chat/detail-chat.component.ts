import { Component, OnInit } from '@angular/core';
import { Merchant } from 'src/app/user/merchant/merchant.model';
import { MerchantService } from 'src/app/user/merchant/merchant.service';

@Component({
  selector: 'app-detail-chat',
  templateUrl: './detail-chat.component.html',
  styleUrls: ['./detail-chat.component.css']
})
export class DetailChatComponent implements OnInit {

  catering: Merchant = new Merchant();
  public loginuser: any = {};

  constructor(
    private merchantService: MerchantService
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  ngOnInit(): void {

    this.catering = this.merchantService.viewCatering;
    console.log(this.catering);
    

    console.log(this.loginuser);
    
  }

}
