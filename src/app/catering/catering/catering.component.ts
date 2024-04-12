import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, switchMap, timer } from 'rxjs';
import { Merchant } from 'src/app/user/merchant/merchant.model';
import { MerchantService } from 'src/app/user/merchant/merchant.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-catering',
  templateUrl: './catering.component.html',
  styleUrls: ['./catering.component.css']
})
export class CateringComponent implements OnInit {

  public loginuser: any = {};
  merchants!: Merchant[];
  filterMerchants!: Merchant[];
  realTimeDataSubscription$!: Subscription;
  city!: Merchant[];
  searchText = '';
  filteredItem: Merchant[] = [];

  private loadData(){
    this.getMerchants();
  }

  constructor(
    private router: Router,
    private authService: UserService,
    private formBuilder : FormBuilder,
    private toastr: ToastrService,
    private http: HttpClient,
    private merchantService: MerchantService,
    private sanitizer: DomSanitizer
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  ngOnInit(): void {

    this.loadData();
    // console.log(this.searchText.length);

    // this.getCityMerchant();
  }

  private getMerchants(){
    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.merchantService.getAllMerchant(this.loginuser.accessToken)))
      .subscribe(data => {

        this.merchants = data.sort();
        // console.log(this.merchants);

    });
  }

  onOpenCatering(merchant: Merchant): void{
    console.log(merchant);
    this.merchantService.viewCatering = merchant;
    this.router.navigate(['/detailCatering']);
  }

  getImageUrl(blob: Blob) {
    // console.log(blob);
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  // getCityMerchant(){
  //   this.merchantService.getCityMerchant(this.loginuser.accessToken).subscribe(
  //     (data) => {
  //       this.city = data;

  //     }
  //   )
  // }
  onSearch(){
    this.filteredItem = this.merchants.filter(item =>
      item.merchant_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.city.toLowerCase().includes(this.searchText.toLowerCase())
    );

    // console.log(this.searchText.length);

  }

}
