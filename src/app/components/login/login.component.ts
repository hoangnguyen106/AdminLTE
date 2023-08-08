import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthserviceService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  login: FormGroup | any;
  message: boolean = false;

  constructor(
    private authService: AuthserviceService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.login = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
    });
  }

  logindata(login: FormGroup) {
    this.authService.login().subscribe(
      (res) => {
        console.log(res);
        const user = res.find((a: any) => {
          return (
            a.email === this.login.value.email &&
            a.password === this.login.value.password
          );
        });

        if (user) {
          this.toastrService.success(
            `Welcome to AdminLTE!`,
            'Login Successful'
          );
          this.login.reset();
          this.router.navigate(['/admin']);
        } else {
          this.toastrService.error('Login Fail!');
          this.router.navigate(['/login']);
        }
      }
      // (err) => {
      //   alert('Something was wrong');
      // }
    );
  }
}
