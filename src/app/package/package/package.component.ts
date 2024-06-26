import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PackageService } from '../package.service';
import { Food, SearchModelFood } from '../food.model';
import Swal from 'sweetalert2';
import { FoodService } from '../food.service';
import { Subscription, switchMap, timer } from 'rxjs';
import { Package } from '../package.model';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {

  @ViewChild('closeAddFoodBtn') closeAddFood: ElementRef | undefined;
  @ViewChild('closeUpdateFoodBtn') closeUpdateFood: ElementRef | undefined;
  @ViewChild('closeDeleteFoodBtn') closeDeleteFood: ElementRef | undefined;
  @ViewChild('closeDeletePackageBtn') closeDeletePackage: ElementRef | undefined;

  public loginuser: any = {};
  addFoodForm!: FormGroup;
  editFoodForm!: FormGroup;
  public foods!: Food[];
  public packagesActive!: Package[];
  public packagesInActive!: Package[];
  filteredItem: Food[] = [];
  page: number = 1;
  tableSize: number = 5;

  deletedFood!: Food;
  deletedPackage!: string;

  realTimeDataSubscription$!: Subscription;

  model: SearchModelFood = new SearchModelFood();

  constructor(
    private formBuilder : FormBuilder,
    private packageService: PackageService,
    private foodService: FoodService,
    private router: Router,
    private sanitizer: DomSanitizer
    ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);


    this.addFoodForm = this.formBuilder.group({
      food_name: ['', Validators.required],
      food_id: [''],
      merchant_username: ['']
    });

    this.editFoodForm = this.formBuilder.group({
      food_name: ['', Validators.required],
      food_id: [''],
      merchant_username: ['']
    });
  }

  ngOnInit(): void {
    this.getFood();
    this.getPackage();
  }

  searchSetting(){
    this.page = 1;
  }

  getFood(){

    const initData = {
      merchant_username: this.loginuser.userEntity.username
    };

    this.realTimeDataSubscription$ = timer(0, 1000)
    .pipe(switchMap(_ => this.foodService.findFood(initData, this.loginuser.accessToken))).subscribe(data =>{
      this.foods = data;
    });
  }


  getPackage(){
    const initDataActive = {
      merchant_username: this.loginuser.userEntity.username,
      isActive: true
    };

    this.realTimeDataSubscription$ = timer(0, 1000)
    .pipe(switchMap(_ => this.packageService.getPackageByMerchant(initDataActive, this.loginuser.accessToken))).subscribe(data =>{
      this.packagesActive = data;
    });

    const initDataInActive = {
      merchant_username: this.loginuser.userEntity.username,
      isActive: false
    };

    this.realTimeDataSubscription$ = timer(0, 1000)
    .pipe(switchMap(_ => this.packageService.getPackageByMerchant(initDataInActive, this.loginuser.accessToken))).subscribe(data =>{
      this.packagesInActive = data;
    });
  }

  loadImage(blob: Blob){
    let imageUrl = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  addFood(){

    this.addFoodForm.patchValue({
      merchant_username: this.loginuser.userEntity.username
    });

    this.foodService.addFood(this.addFoodForm.value, this.loginuser.accessToken).subscribe(
      (response: Food) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Add Food",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Add Food",
          showConfirmButton: true,
          timer: 1500
        })
      });

    this.addFoodForm.reset();
    this.closeAddFoodModal();
  }

  updateFood(food: Food){
    console.log(food);

    this.editFoodForm.patchValue({
      food_name: food.food_name,
      food_id: food.food_id
    });
  }

  onUpdateFood(){
    this.editFoodForm.patchValue({
      merchant_username: this.loginuser.userEntity.username
    });

    this.foodService.updateFood(this.editFoodForm.value, this.loginuser.accessToken).subscribe(
      (response: Food) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Update Food",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Update Food",
          showConfirmButton: true,
          timer: 1500
        })
      });

      this.editFoodForm.reset();
      this.closeUpdateFoodModal();
  }

  deleteFood(i: number){
    this.deletedFood = this.foods[i];
  }

  onDeleteFood(){

    // console.log(this.deletedFood.food_id);

    this.foodService.deleteFood(this.deletedFood.food_id, this.loginuser.accessToken).subscribe(
      (response: void) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Delete Food",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Delete Food",
          showConfirmButton: true,
          timer: 1500
        })
    });

    this.closeDeleteFoodModal();
  }

  viewPackage(package_header: string){
    this.packageService.package_header = package_header;
    this.router.navigate(['/addPackage'], { queryParams: { edit: true }});
  }

  deletePackage(package_header: string){
    this.deletedPackage = package_header;
  }

  onDeletePackage(){

    this.packageService.deletePackage(this.deletedPackage, this.loginuser.accessToken).subscribe(
      (response: void) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Delete Package",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Delete Package",
          showConfirmButton: true,
          timer: 1500
        })
    });

    this.closeDeletePackageModal();
  }


  closeAddFoodModal(){
    if(this.closeAddFood){
      this.closeAddFood.nativeElement.click();
    }
  }

  closeUpdateFoodModal(){
    if(this.closeUpdateFood){
      this.closeUpdateFood.nativeElement.click();
    }
  }

  closeDeleteFoodModal(){
    if(this.closeDeleteFood){
      this.closeDeleteFood.nativeElement.click();
    }
  }

  closeDeletePackageModal(){
    if(this.closeDeletePackage){
      this.closeDeletePackage.nativeElement.click();
    }
  }

  // onSearch(){
  //   this.filteredItem = this.foods.filter(item =>
  //     item.food_name.toLowerCase().includes(this.searchText.toLowerCase())
  //   );
  // }

  onTableDataChange(event: any){
    this.page = event;
    // this.getFood();
  }
}
