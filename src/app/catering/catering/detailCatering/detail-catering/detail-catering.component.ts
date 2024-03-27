import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Chat } from 'src/app/chat/chat.model';
import { ChatService } from 'src/app/chat/chat.service';
import { Merchant } from 'src/app/user/merchant/merchant.model';
import { MerchantService } from 'src/app/user/merchant/merchant.service';

@Component({
  selector: 'app-detail-catering',
  templateUrl: './detail-catering.component.html',
  styleUrls: ['./detail-catering.component.css']
})
export class DetailCateringComponent implements OnInit {


  viewCatering: Merchant = new Merchant;
  public loginuser: any = {};
  newChat!: FormGroup;

  constructor(
    private router: Router,
    private merchantService: MerchantService,
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    private formBuilder : FormBuilder
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  ngOnInit(): void {

    this.viewCatering = this.merchantService.viewCatering;
    console.log(this.viewCatering);

    this.newChat = this.formBuilder.group({
      parent_id : [''],
      merchant_name : ['']
    });

    console.log(this.loginuser.userEntity);
    
    
  }

  goOurPackage(){
    let i = document.getElementById('ourPackage');
    console.log(i);
    
    
  }

  getImageUrl(blob: Blob) {
    // console.log(blob);
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  onChat(viewCatering: any){
    console.log(viewCatering);
    this.merchantService.viewCatering = viewCatering;
    this.router.navigate(['/detailChat']);

    this.newChat.controls['parent_id'].setValue(this.loginuser.userEntity.id);
    this.newChat.controls['merchant_name'].setValue(this.viewCatering.merchant_name);

    console.log(this.newChat.value);
    

    this.chatService.addChat(this.newChat.value, this.loginuser.accessToken).subscribe(
      (response: Chat) => {
        console.log(response);
        
      }
    )
  }

}
