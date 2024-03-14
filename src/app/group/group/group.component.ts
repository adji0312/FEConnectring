import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('closeJoinGroup') closeJoinGroup: ElementRef | undefined;
  @ViewChild('closeCreateGroup') closeCreateGroup: ElementRef | undefined;
  @ViewChild('closeDeleteGroup') closeDeleteGroup: ElementRef | undefined;
  @ViewChild('closeLeaveGroup') closeLeaveGroup: ElementRef | undefined;

  public loginuser: any = {};
  groupForm!: FormGroup;
  editCustomerForm!: FormGroup;
  public flagOwner!: number;
  public groupID!: number;
  realTimeDataSubscription$!: Subscription;
  public groups!: Group[];

  public findGroup!: Group;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private groupService: GroupService,
    private customerService: CustomerService
  ) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);

    this.groupForm = this.formBuilder.group({
      group_name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postal_code: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      owner: [''],
      username: [''],
    });

    this.editCustomerForm = this.formBuilder.group({
      invite_code: ['', Validators.required],
      username: ['']
    });

   }

  ngOnInit(): void {

    // console.log(this.loginuser.userEntity.username);

    this.groupForm.patchValue({
      username: this.loginuser.userEntity.username
    });

    console.log(this.groupForm);

    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.groupService.findGroup(this.groupForm.value, this.loginuser.accessToken)))
      .subscribe(data => {

      this.findGroup = data;
      // console.log(this.findGroup);

      this.groupForm.patchValue({
        group_name: this.findGroup.group_name,
        address: this.findGroup.address,
        city: this.findGroup.city,
        postal_code: this.findGroup.postal_code,
        owner:  this.findGroup.owner
      });
    });


    // console.log(this.loginuser.userEntity);
    // this.flagOwner = 1;

    // this.ownerGroup();
    // console.log(this.loginuser.accessToken);


  }

  addGroup(){
    this.groupForm.patchValue({
      owner: this.loginuser.userEntity.username
    });

    // console.log(this.groupForm.value);

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


    this.groupForm.reset();
    this.closeCreateGroupModal();


  }

  updateGroup(){
    this.groupForm.patchValue({
      owner: this.loginuser.userEntity.username
    });

    // console.log(this.groupForm.value);

    this.groupService.updateGroup(this.groupForm.value, this.loginuser.accessToken).subscribe(
      (response: Group) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Update Group",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Update Group",
          showConfirmButton: true,
          timer: 1500
        })
      }
    );
  }

  checkOwner(){

    if(!this.findGroup){
      return true;
    }

    if(this.findGroup.owner == this.loginuser.userEntity.username){
      return false;
    }

    return true;
  }

  joinGroup(){
    this.editCustomerForm.patchValue({
      username: this.loginuser.userEntity.username
    });

    this.customerService.joinGroup(this.editCustomerForm.value, this.loginuser.accessToken).subscribe(
      (response: Customer) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Join Group",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Invite code is invalid",
          showConfirmButton: true,
          timer: 1500
        })
    });

    this.editCustomerForm.reset();
    this.closeJoinGroupModal();
  }


  leaveGroup(){
    this.editCustomerForm.patchValue({
      username: this.loginuser.userEntity.username
    });

    this.customerService.leaveGroup(this.editCustomerForm.value, this.loginuser.accessToken).subscribe(
      (response: Customer) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Leave Group",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Leave Group",
          showConfirmButton: true,
          timer: 1500
        })

    });

      this.editCustomerForm.reset();
      this.closeLeaveGroupModal();
  }

  deleteGroup(){
    this.groupService.deleteGroup(this.findGroup.owner, this.loginuser.accessToken).subscribe(
      (response: void) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Success Delete Group",
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Failed Delete Group",
          showConfirmButton: true,
          timer: 1500
        })
    });


    this.groupForm.reset();
    this.closeDeleteGroupModal();
  }

  closeJoinGroupModal(){

    if(this.closeJoinGroup){
      this.closeJoinGroup.nativeElement.click();
    }

  }

  closeCreateGroupModal(){

    if(this.closeCreateGroup){
      this.closeCreateGroup.nativeElement.click();
    }

  }

  closeLeaveGroupModal(){
    if(this.closeLeaveGroup){
      this.closeLeaveGroup.nativeElement.click();
    }
  }

  closeDeleteGroupModal(){
    if(this.closeDeleteGroup){
      this.closeDeleteGroup.nativeElement.click();
    }
  }

}
