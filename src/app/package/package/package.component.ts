import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PackageService } from '../package.service';
import { Food } from '../food.model';
import Swal from 'sweetalert2';
import { FoodService } from '../food.service';
import { Subscription, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {

  @ViewChild('closeAddFoodBtn') closeAddFood: ElementRef | undefined;
  @ViewChild('closeUpdateFoodBtn') closeUpdateFood: ElementRef | undefined;
  @ViewChild('closeDeleteFoodBtn') closeDeleteFood: ElementRef | undefined;

  public loginuser: any = {};
  addFoodForm!: FormGroup;
  editFoodForm!: FormGroup;
  public foods!: Food[];
  deletedFood!: Food;

  realTimeDataSubscription$!: Subscription;

  constructor(
    private formBuilder : FormBuilder,
    private packageService: PackageService,
    private foodService: FoodService
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

  updateFood(i: number){
    this.editFoodForm.patchValue({
      food_name: this.foods[i].food_name,
      food_id: this.foods[i].food_id
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

}
