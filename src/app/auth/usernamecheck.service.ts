import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class UsernamecheckService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  validateUsernameNotTaken(control: AbstractControl) {
    // console.log(control);
    return this.userService.checkUsername(control.value).pipe(
      map(res => {
        console.log(res);
        return res ? { usernameTaken: true } : null;
      })
    );
  }

  // checkUsernameNotTaken(username: string): Observable<boolean> {
  //   return this.http.get("assets/fakedb.json").pipe(
  //     map((usernameList: Array<any>) =>
  //       usernameList.filter(user => user.username === username)
  //     ),
  //     map(users => !users.length)
  //   );
  // }
}
