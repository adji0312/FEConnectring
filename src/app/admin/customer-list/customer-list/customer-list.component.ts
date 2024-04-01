// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Subscription, switchMap, timer } from 'rxjs';
// import { Customer } from 'src/app/user/customer/customer.model';
// import { CustomerService } from 'src/app/user/customer/customer.service';
// import { User } from 'src/app/user/user.model';
// import { UserService } from 'src/app/user/user.service';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-customer-list',
//   templateUrl: './customer-list.component.html',
//   styleUrls: ['./customer-list.component.css']
// })
// export class CustomerListComponent implements OnInit {

//   realTimeDataSubscription$!: Subscription;
//   public loginuser: any = {};
//   customers!: Customer[];
//   deleteCustomer: Customer = new Customer;
//   addCustomerForm!: FormGroup;

//   private loadData(){
//     this.getCustomers();
//   }

//   constructor(
//     private customerService: CustomerService,
//     private formBuilder : FormBuilder,
//     private http: HttpClient,
//     private userService: UserService
//   ) {
//     this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
//   }

//   ngOnInit(): void {

//     this.loadData();

//     this.addCustomerForm = this.formBuilder.group({
//       username : ['', [Validators.required]],
//       name : ['', [Validators.required]],
//       phone : ['', [Validators.required]],
//       password : ['', [Validators.required]],
//     });
//   }

//   private getCustomers(){
//     this.realTimeDataSubscription$ = timer(0, 1000)
//       .pipe(switchMap(_ => this.customerService.getAllCustomer(this.loginuser.accessToken)))
//       .subscribe(data => {
//         this.customers = data.sort();
//     });
//   }

//   onOpenModal(customer: Customer, mode: string){
//     console.log(customer);
//     // console.log(mode);

//     if(mode == 'view'){
//       // this.editMerchant = merchant;
//       // this.editMerchantForm.setValue({
//       //   username : this.editMerchant.parent.username,
//       //   address : this.editMerchant.address,
//       //   city : this.editMerchant.city,
//       //   phone : this.editMerchant.phone,
//       //   postal_code : this.editMerchant.postal_code,
//       //   merchant_name : this.editMerchant.merchant_name,
//       // });
//     }else if(mode === 'delete'){
//       this.deleteCustomer = customer;
//       console.log(this.deleteCustomer);
      
//       // console.log(this.deleteCustomer.parent.username);
      
//     }
    
//   }

//   onAddCustomer(){

//     this.addCustomerForm.controls['password'].setValue('12345678');

//     console.log(this.addCustomerForm.value);
    

//     if(this.addCustomerForm.invalid){
//       return;
//     }

//     this.userService.regisUser(this.addCustomerForm.value).subscribe(
//       (response: User) => {
//         console.log(response);
        
//         Swal.fire({
//           position: 'center',
//           icon: 'success',
//           title: "Success Add Customer",
//           showConfirmButton: true,
//           timer: 1500
//         })
//       },
//       (error: HttpErrorResponse) => {
//         console.log(error);
        
//       }
//     );
    
//     document.getElementById('add-customer-form')?.click();
//     this.addCustomerForm.reset();
    
//   }

// }
