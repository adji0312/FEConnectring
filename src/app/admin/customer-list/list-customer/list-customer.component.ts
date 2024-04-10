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

  private loadData(){
    this.getCustomers();
  }

  constructor(
    private customerService: CustomerService,
    private formBuilder : FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  ngOnInit(): void {

    this.loadData();

    this.addCustomerForm = this.formBuilder.group({
      username : ['', [Validators.required]],
      name : ['', [Validators.required]],
      phone : ['', [Validators.required]],
      password : [''],
    });

    this.viewCustomerForm = this.formBuilder.group({
      name : [''],
      phone : [''],
      username : ['']
    });
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
    
    document.getElementById('add-customer-form')?.click();
    this.addCustomerForm.reset();
    
  }

  getImageUrl(blob: Blob) {
    let objectURL = 'data:image/jpeg;base64,' + blob;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

}
