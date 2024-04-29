import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Merchant } from 'src/app/user/merchant/merchant.model';
import { MerchantService } from 'src/app/user/merchant/merchant.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public loginuser: any = {};

  merchantList!: Merchant[];

  constructor(
    private http: HttpClient,
    private merchantService: MerchantService,
    private sanitizer: DomSanitizer,
    private router: Router
            ) {
    this.http = http;
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
   }

  ngOnInit(): void {

    this.merchantService.getRandomMerchant(this.loginuser.accessToken).subscribe(data => {
      this.merchantList = data;
      // console.log(this.merchantList);
    })
  }

  getImageUrl(blob: Blob) {
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  onOpenCatering(merchant: Merchant): void{
    // console.log(merchant);
    this.merchantService.viewCatering = merchant;
    this.router.navigate(['/detailCatering']);
  }
}
