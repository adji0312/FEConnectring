import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupService } from '../group.service';
import { Group } from '../group.model';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Subscription, switchMap, timer } from 'rxjs';
import { CustomerService } from 'src/app/user/customer/customer.service';
import { Customer } from 'src/app/user/customer/customer.model';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  public loginuser: any = {};
  groupForm!: FormGroup;
  editCustomerForm!: FormGroup;
  public flagOwner!: number;
  public groupID!: number;
  realTimeDataSubscription$!: Subscription;
  public groups!: Group[];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private groupService: GroupService,
    private customerService: CustomerService
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);

    // this.editCustomerForm.patchValue({
    //   name: this.loginuser.us
    // });
    
   }

  ngOnInit(): void {
    this.groupForm = this.formBuilder.group({
      group_name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postal_code: ['', Validators.required],
      owner: [''],
      username: [''],
    });

    this.editCustomerForm = this.formBuilder.group({
      invite_code: ['', Validators.required],
      username: ['', Validators.required]
    });

    // console.log(this.loginuser.userEntity);
    // this.flagOwner = 1;
    
    this.ownerGroup();
    console.log(this.loginuser.accessToken);
    
    this.groupService.getAllGroup(this.loginuser.accessToken).subscribe(data => {
      console.log(data);
      
    });
  }

  addGroup(){
    this.groupForm.patchValue({
      owner: this.loginuser.userEntity.username
    });

    console.log(this.groupForm.value);
    
    
    this.groupService.addGroup(this.groupForm.value, this.loginuser.accessToken).subscribe(
      (response: Group) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Create Group",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Create Group",
          showConfirmButton: true,
          timer: 1500
        })
      }
    );

    this.customerService.updateCustomerGroupID(this.groupForm.get('username')?.value, this.loginuser.accessToken).subscribe(data => {
      console.log(data);
      
    });

    console.log(this.loginuser.accessToken);
    
    

    
  }

  updateCustomer(){
    console.log(this.loginuser.accessToken);
    
    
  }

  ownerGroup(){
    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.groupService.findGroupByOwner(this.loginuser.userEntity.username, this.loginuser.accessToken)))
      .subscribe(data => {
        if(data){
          this.groupID = data.id;
          this.flagOwner = 1;
        }else{
          this.flagOwner = 0;
        }
    });
    // this.groupService.findGroupByOwner(this.loginuser.userEntity.username, this.loginuser.accessToken).subscribe(
    //   (response: Group) => {
    //     if(response){
    //       console.log('ada');
          
    //       this.flagOwner = 1;
    //     }else{
    //       console.log('tdk ada');
          
    //       this.flagOwner = 0;
    //     }
        
        
    //   },
    //   (error: HttpErrorResponse) => {
    //     console.log(error);
        
    //   }
    // );
  }

  joinGroup(){
    this.editCustomerForm.patchValue({
      username: this.loginuser.userEntity.username
    });
    
    this.customerService.joinGroup(this.editCustomerForm.value, this.loginuser.accessToken).subscribe(data => {
      console.log(data);
      
    });
  }

}
