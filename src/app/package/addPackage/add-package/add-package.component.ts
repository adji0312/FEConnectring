import { Component, ElementRef, NgModule, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PackageService } from '../../package.service';
import { Package } from '../../package.model';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, finalize, switchMap, timer } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Food } from '../../food.model';
import { FoodService } from '../../food.service';


@Component({
  selector: 'app-add-package',
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.css']
})

export class AddPackageComponent implements OnInit {

  @ViewChild('closeAddPackage') closeAddPackage!: ElementRef;
  @ViewChild('closeEditPackage') closeEditPackage!: ElementRef;

  public loginuser: any = {};
  addPackageForm!: FormGroup;

  combinedForm!: FormGroup;
  packageForms: FormGroup[] = [];
  foodForm!: FormGroup;

  public foods!: Food[];
  dropdownSettings!: any;

  packageList!: Package[];
  selectedPackage!: Package;
  selectedFood: Array<any> = [];

  package_image: File | null = null;

  realTimeDataSubscription$!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private packageService: PackageService,
    private foodService: FoodService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private af: AngularFireStorage,
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);




  }


  ngOnInit(): void {

    this.addPackageForm = this.formBuilder.group({
      start_date: [''],
      end_date: [''],
      value_date: [''],
      price: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      image: [''],
      food_img: [''],
      merchant_username: [''],
      package_id: [''],
      packageItemList: [],
    });

    this.combinedForm = this.formBuilder.group({
      packageForms: this.formBuilder.array([])
    });

    const initData = {
      merchant_username: this.loginuser.userEntity.username
    };

    this.foodService.findFood(initData, this.loginuser.accessToken).subscribe(data =>{
      this.foods = data;
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'food_id',
      textField: 'food_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };

    var editMode;
    editMode = this.route.snapshot.queryParamMap.get('edit') === 'true';

    if(editMode){
      const openModalButton = this.elementRef.nativeElement.querySelector('#openModalButton');
      if (openModalButton) {
        openModalButton.style.display = 'none';
      }

      const newFormGroup = this.createPackageFormGroup();

      newFormGroup.patchValue({
        package_header: this.packageService.package_header
      });

      this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.packageService.getPackageByPackageHeader(newFormGroup.value, this.loginuser.accessToken))).subscribe(data => {
        this.packageList = data;
      });
    }
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

  removePackageForm(index: number) {
    this.packageForms.splice(index, 1);
    this.combinedForm.setControl('packageForms', this.formBuilder.array(this.packageForms));
  }

  getFoodNames(pack: Package): string {

    pack.packageItemDtoList.forEach(packageItem => { // Accessing 'food_name' within 'food' object
    });

    // return "true";
    return pack.packageItemDtoList.map(packageItem => packageItem.food_name).join(', ');
  }

  addPackage(){
    var startDate = new Date(this.addPackageForm.value.start_date);
    var endDate = new Date(this.addPackageForm.value.end_date);
    var curr_date = new Date(startDate);

    while (curr_date <= endDate) {

      const newFormGroup = this.createPackageFormGroup();

      newFormGroup.patchValue({
        start_date: this.addPackageForm.value.start_date,
        end_date: this.addPackageForm.value.end_date,
        value_date: new Date(curr_date),
        merchant_username: this.loginuser.userEntity.username
      });

      // console.log(newFormGroup.value);

      this.packageForms.push(newFormGroup);
      this.combinedForm.setControl('packageForms', this.formBuilder.array(this.packageForms));
      curr_date.setDate(curr_date.getDate() + 1);
    }

    // console.log(this.combinedForm.value.packageForms);

    this.packageService.addPackage(this.combinedForm.value.packageForms, this.loginuser.accessToken).subscribe(
      (response: Package[]) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Create Package",
          showConfirmButton: true,
          timer: 1500
        })

        const openModalButton = this.elementRef.nativeElement.querySelector('#openModalButton');
        if (openModalButton) {
          openModalButton.style.display = 'none';
        }

        const newFormGroup = this.createPackageFormGroup();

        newFormGroup.patchValue({
          package_header: response[0].package_header
        });

        // console.log(newFormGroup.value);
        this.packageService.getPackageByPackageHeader(newFormGroup.value, this.loginuser.accessToken).subscribe(data => {
            this.packageList = data;
        });

      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Create Package",
          showConfirmButton: true,
          timer: 1500
        })
      }
    );

    const packageForms = this.combinedForm.get('packageForms') as FormArray;
    var formCount = packageForms.length;

    while(formCount){
      this.removePackageForm(0);
      formCount--;
    }


    this.addPackageForm.reset();

    this.combinedForm.reset();
    this.combinedForm.markAsPristine();
    this.combinedForm.markAsUntouched();

    this.closeAddPackageModal();

  }

  closeAddPackageModal(){
    if(this.closeAddPackage){
      this.closeAddPackage.nativeElement.click();
    }
  }

  closeEditPackageModal(){
    if(this.closeEditPackage){
      this.closeEditPackage.nativeElement.click();
    }
  }

  editPackage(pack: Package){
    this.selectedPackage = pack;

    this.addPackageForm.patchValue({
      price: this.selectedPackage.price
    });

    this.selectedFood = this.selectedPackage.packageItemDtoList;
  }

  onUpdatePackage(event: any){

    var packageList = this.addPackageForm.value.packageItemList;
    var packageItemDto = [];

    for (let i = 0; i < packageList.length; i++) {
      const itemFormGroup = this.formBuilder.group({
        food: this.formBuilder.group({
          food_id: [packageList[i].food_id]
        })
      });

      packageItemDto[i] = itemFormGroup.value;
    }


    this.addPackageForm.patchValue({
      packageItemList: packageItemDto,
      package_id: this.selectedPackage.package_id,
    });

    if(this.package_image == null){
      this.packageService.updatePackage(this.addPackageForm.value, this.loginuser.accessToken).subscribe(
        (response: Package) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: "Success Update Package",
            showConfirmButton: true,
            timer: 1500
          })
        },
        (error: HttpErrorResponse) => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: "Failed Update Package",
            showConfirmButton: true,
            timer: 1500
          })
      });

      this.addPackageForm.reset();
      this.closeEditPackageModal();

      return null;
    }
    else{
      const filePath = `food/${this.package_image.name}_${new Date().getTime()}`;
      const fileRef = this.af.ref(filePath);
      const uploadTask = this.af.upload(filePath, this.package_image);

      return uploadTask.then(snapshot => {
        // console.log(fileRef.getDownloadURL());
        return fileRef.getDownloadURL().subscribe(data => {
          console.log(data);

          this.addPackageForm.patchValue({
            package_id: this.selectedPackage.package_id,
            food_img: data
          });

          this.packageService.updatePackage(this.addPackageForm.value, this.loginuser.accessToken).subscribe(
            (response: Package) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: "Success Update Package",
                showConfirmButton: true,
                timer: 1500
              })
            },
            (error: HttpErrorResponse) => {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: "Failed Update Package",
                showConfirmButton: true,
                timer: 1500
              })
            }
          );
          this.package_image = null
          this.addPackageForm.reset();
          this.closeEditPackageModal();
        });
      });

    }


  }

  onFileSelected(event: any): void {
    this.package_image= event.target.files[0];
  }

  // readFile(file: File): void {
  //   const formData: FormData = new FormData();
  //   formData.append('file', file, file.name);


  //   console.log(formData);
  // }

}
