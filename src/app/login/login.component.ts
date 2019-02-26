import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { UserLoginService } from '../shared/services/user-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private userLoginService: UserLoginService
  ) {
    this.loginForm = fb.group({
      username: this.fb.control('', [Validators.required]),
    });
  }

  ngOnInit() { }

  checkUsername() {
    console.log(this.loginForm.value);
    const username = this.loginForm.value.username;
    const method = 'login';
    // Comment from here
    if (this.loginForm.value.username === 'a') {
      this.userService.setUsername(username);
      this.userService.setMethod(method);
      this.router.navigate(['/video-auth']);
    }
    // Comment till here

    // Uncomment
    // this.userLoginService.verifyUsername(username).subscribe(
    //   res => {
    //     if (res.toString() === 'Valid') {
    //       console.log(res);
    //       this.userService.setUsername(username);
    //       this.userService.setMethod(method);
    //       this.router.navigate(['/face-scan']);
    //     } else {
    //       alert('Invalid Username');
    //     }
    //   }
    // );

  }

  redirectToRegister() {
    this.router.navigate(['/register']);
  }
}
