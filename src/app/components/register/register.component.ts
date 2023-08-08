import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  signup: FormGroup | any;
  signuser: any;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.signup = new FormGroup({
      fullName: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
    });
  }
  signupdata(signup: FormGroup) {
    this.signuser = this.signup.value.fullName;
    this.http
      .post<any>('http://localhost:3000/signup', this.signup.value)
      .subscribe(
        (res) => {
          console.log(res);
          this.toastrService.success('Register Successful');
          this.signup.reset();
          this.router.navigate(['/login']);
        },
        (err) => {
          this.toastrService.success('Register fail!');
        }
      );
  }
}
