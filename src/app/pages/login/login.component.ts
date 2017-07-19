import {Component} from '@angular/core';
import {FormGroup,FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { LoginService } from './login.service';
import { Logger } from "angular2-logger/core";
import { ToasterService, Toast} from 'angular2-toaster';
import {Router} from '@angular/router';

import 'style-loader!./login.scss';

@Component({
  selector: 'login',
  templateUrl: './login.html'
})
export class Login {

  public form:FormGroup;
  public user:AbstractControl;
  public password:AbstractControl;
  public submitted:boolean = false;
  // private toasterService: ToasterService;

  constructor(fb:FormBuilder,
              private loginService: LoginService,
              private toasterService: ToasterService,
              private router: Router,
              private log: Logger) {
    this.form = fb.group({
      'user': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    // this.toasterService = toasterService;
    this.user = this.form.controls['user'];
    this.password = this.form.controls['password'];
  }

  async onSubmit(values:Object): Promise<void>{
    try {
      if (this.form.valid) {
        this.log.debug('user:', values.user);
        this.log.debug('password:', values.password);
        const response = await this.loginService.login(values.user, values.password);
        // this._cookieService.remove("access_token");

        console.log('response:',response);

        this.router.navigate(['/pages/dashboard']);
      }
    } catch (e) {
      var toast: Toast = {
        type: 'error',
        // title: 'close button',
        body: '登录失败,请确定网络和输入没有问题后重试!',
        timeout: 10000,
        // showCloseButton: true
      };

      this.toasterService.pop(toast);
      this.log.error('Exception:',e);
    }
  }
}
