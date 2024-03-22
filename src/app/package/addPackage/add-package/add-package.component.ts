import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PackageService } from '../../package.service';
import { Package } from '../../package.model';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-package',
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.css']
})
export class AddPackageComponent implements OnInit {

  @ViewChild('openAddPackage') openAddPackage!: ElementRef;
  @ViewChild('closeAddPackage') closeAddPackage: ElementRef | undefined;

  public loginuser: any = {};
  addPackageForm!: FormGroup;

  combinedForm!: FormGroup;
  packageForms: FormGroup[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private packageService: PackageService,
    private route: ActivatedRoute
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);

    this.addPackageForm = this.formBuilder.group({
      start_date: [''],
      end_date: [''],
      value_date: [''],
      price: [''],
      food_img: [''],
      merchant_username: ['']
    });

    this.combinedForm = this.formBuilder.group({
      packageForms: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {

    this.route.fragment.subscribe(fragment => {
      if (fragment === 'triggerButton') {
        this.openAddPackageModal();
      }
    });
  }

  createPackageFormGroup(): FormGroup {
    return this.formBuilder.group({
      start_date: [''],
      end_date: [''],
      value_date: [''],
      price: [''],
      food_img: [''],
      merchant_username: ['']
    });
  }

  removePackageForm(index: number) {
    // Remove a form group dynamically
    this.packageForms.splice(index, 1);
    this.combinedForm.setControl('packageForms', this.formBuilder.array(this.packageForms));
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
        value_date: curr_date,
        merchant_username: this.loginuser.userEntity.username
      });

      this.packageForms.push(newFormGroup);
      this.combinedForm.setControl('packageForms', this.formBuilder.array(this.packageForms));

      // console.log(curr_date);
      // this.addPackageForm.patchValue({
      //   value_date: curr_date,
      //   merchant_username: this.loginuser.userEntity.username
      // });

      curr_date.setDate(curr_date.getDate() + 1);
    }

    console.log(this.combinedForm.value.packageForms);

    this.packageService.addPackage(this.combinedForm.value.packageForms, this.loginuser.accessToken).subscribe(
      (response: Package) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Create Package",
          showConfirmButton: true,
          timer: 1500
        })
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
    let i = formCount;

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

  openAddPackageModal(){
    if(this.openAddPackage){
      this.openAddPackage.nativeElement.click();
    }
  }

  closeAddPackageModal(){
    if(this.closeAddPackage){
      this.closeAddPackage.nativeElement.click();
    }
  }

}
