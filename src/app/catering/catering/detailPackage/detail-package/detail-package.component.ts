import { Component, OnInit } from '@angular/core';
import { Package } from 'src/app/package/package.model';
import { Observable, Subscription, finalize, switchMap, timer } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PackageService } from 'src/app/package/package.service';

@Component({
  selector: 'app-detail-package',
  templateUrl: './detail-package.component.html',
  styleUrls: ['./detail-package.component.css']
})
export class DetailPackageComponent implements OnInit {

  public loginuser: any = {};
  packageList!: Package[];
  realTimeDataSubscription$!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private packageService: PackageService,
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  ngOnInit(): void {

    const newFormGroup = this.createPackageFormGroup();

      newFormGroup.patchValue({
        package_header: this.packageService.package_header
      });

      this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.packageService.getPackageByPackageHeader(newFormGroup.value, this.loginuser.accessToken))).subscribe(data => {
        this.packageList = data;
        // console.log(this.packageList);
      });

      
  }

  createPackageFormGroup(): FormGroup {
    return this.formBuilder.group({
      start_date: [''],
      end_date: [''],
      value_date: [''],
      price: [''],
      food_img: [''],
      merchant_username: [''],
      package_header: ['']
    });
  }

  getFoodNames(pack: Package): string {

    pack.packageItemDtoList.forEach(packageItem => { // Accessing 'food_name' within 'food' object
    });

    // return "true";
    return pack.packageItemDtoList.map(packageItem => packageItem.food_name).join(', ');
  }

}
