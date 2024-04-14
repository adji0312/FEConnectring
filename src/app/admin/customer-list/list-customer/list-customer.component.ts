import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, switchMap, timer } from 'rxjs';
import { Customer } from 'src/app/user/customer/customer.model';
import { CustomerService } from 'src/app/user/customer/customer.service';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.css']
})
export class ListCustomerComponent implements OnInit {

  realTimeDataSubscription$!: Subscription;
  public loginuser: any = {};
  customers!: Customer[];
  deleteCustomer: Customer = new Customer;
  addCustomerForm!: FormGroup;
  viewCustomerForm!: FormGroup;
  addData = new FormData;
  resetPasswordCustomer: Customer = new Customer;
  resetForm!: FormGroup;


  private loadData(){
    this.getCustomers();
  }

  constructor(
    private customerService: CustomerService,
    private formBuilder : FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private authService: UserService
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  ngOnInit(): void {

    this.loadData();

    this.addCustomerForm = this.formBuilder.group({
      username : ['', [Validators.required]],
      name : ['', [Validators.required]],
      phone : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      password : [''],
    });

    this.viewCustomerForm = this.formBuilder.group({
      name : [''],
      phone : [''],
      username : ['']
    });

    this.resetForm = this.formBuilder.group({
      username: ['']
    })
  }

  private getCustomers(){
    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.customerService.getAllCustomer(this.loginuser.accessToken)))
      .subscribe(data => {
        this.customers = data.sort();
    });
  }

  onOpenModal(customer: Customer, mode: string){
    if(mode == 'view'){
      this.viewCustomerForm.setValue({
        name : customer.name,
        phone : customer.phone,
        username : customer.parent.username
      });
    }else if(mode === 'delete'){
      this.deleteCustomer = customer;
      console.log(this.deleteCustomer);
      
      
    }else if(mode === 'reset'){
      this.resetPasswordCustomer = customer;
      console.log(this.resetPasswordCustomer);
      
    }
    
  }

  onDeleteCustomer(customer: Customer){
    console.log(this.deleteCustomer.parent.username);

    this.customerService.deleteCustomer(this.deleteCustomer.parent.username, this.loginuser.accessToken).subscribe(
      (response: Customer) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Delete Customer",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Delete Customer",
          showConfirmButton: true,
          timer: 1500
        })
      }
    );
    document.getElementById('delete-customer-form')!.click();
  }

  onAddCustomer(){

    this.addCustomerForm.controls['password'].setValue('12345678');

    console.log(this.addCustomerForm.value);
    

    if(this.addCustomerForm.invalid){
      return;
    }

    this.addData.append('name', this.addCustomerForm.get('name')?.value);
    this.addData.append('phone', this.addCustomerForm.get('phone')?.value);
    this.addData.append('username', this.addCustomerForm.get('username')?.value);
    this.addData.append('password', this.addCustomerForm.get('password')?.value);

    this.userService.regisUser(this.addData).subscribe(
      (response: User) => {
        console.log(response);
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Add Customer",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Add Customer",
          showConfirmButton: true,
          timer: 1500
        });
      }
    );
    
    this.addData.delete('name');
    this.addData.delete('phone');
    this.addData.delete('username');
    this.addData.delete('password');
    this.addCustomerForm.reset();
    document.getElementById('add-customer-form')?.click();
    
  }

  getImageUrl(blob: Blob) {
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  resetPassword(){

    this.resetForm.patchValue({
      username: this.resetPasswordCustomer.parent.username
    });
    this.authService.resetPassword(this.resetForm.value, this.loginuser.accessToken).subscribe(
      (response: User) => {
        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Reset Customer's Password",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        console.log(error);

        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Reset Customer's Password",
          showConfirmButton: true,
          timer: 1500
        });
        
      }
    )

    document.getElementById('reset-merchant-form')!.click();
    this.resetForm.reset();
  }

}
