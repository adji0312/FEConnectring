import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private router: Router,
    private merchantService: MerchantService
  ) { }

  ngOnInit(): void {

    this.viewCatering = this.merchantService.viewCatering;
    console.log(this.viewCatering);
    
  }

  goOurPackage(){
    let i = document.getElementById('ourPackage');
    console.log(i);
    
    
  }

}
