/**
 * Created by KevinZhu on 03/05/2017.
 */

import { Injectable }    from '@angular/core';
import { HttpService } from '../../http.service';
import { CookieService } from 'ngx-cookie';
import { Logger } from "angular2-logger/core";

@Injectable()
export class LoginService {

  private logoutApi = '/auth/logout';  // URL to web api
  private loginApi = '/auth/login';

  constructor(private httpService: HttpService,
              private cookieService:CookieService,
              private log: Logger) { };

  async login(name: String, password: String): Promise<any> {
    const body = {
      name: name,
      password: password,
      user_type: 'platform'
    };
    const response = await this.httpService.request({ method: 'POST', body, api:this.loginApi });
    this.log.debug('response:',response);

    const res = JSON.parse(response._body);
    const accessToken = res.access_token;
    this.log.debug('accessToken:', accessToken);

    this.cookieService.put("access_token", accessToken);
    this.log.debug('access_token from cookie:',this.cookieService.get("access_token"));

    return response;
  }

  async logout(): Promise<any> {
    const response = await this.httpService.request({method: 'POST', api: this.logoutApi});
    this.log.debug('response:',response);
    this.cookieService.remove("access_token");
    return response;
  }

  private handleError(error: any): Promise<any> {
    this.log.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }


}
