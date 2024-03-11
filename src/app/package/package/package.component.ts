import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PackageService } from '../package.service';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {

  public loginuser: any = {};
  addFoodForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder : FormBuilder,
    private packageService: PackageService
    ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  ngOnInit(): void {

    this.addFoodForm = this.formBuilder.group({
      food_name : ['', Validators.required],
    });
  }

  addFood(){
    this.packageService.addFood(this.addFoodForm.value, this.loginuser.accessToken).subscribe()
  }

}
