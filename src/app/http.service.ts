/**
 * Created by kevinzhu on 03/05/2017.
 */

import {Injectable, Inject} from '@angular/core';
import {Http, Response, RequestOptions, Request, Headers} from '@angular/http';
const config = require('./config/application');
// import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Logger } from "angular2-logger/core";

// const APIURL = 'http://localhost:3000/v1';
const APIURL = config.server.protocol + "://" + config.server.url + "/" + config.server.version;

@Injectable()
export class HttpService {
  constructor(private http: Http, private log: Logger){}

  private getHeader = () => {
    const headers = new Headers();
    headers.append("Content-Type", 'application/json');
    return headers;
  };

  public request = async (req) => {
    const baseUrl = APIURL;
    const requestOptions = new RequestOptions({
      method: req.method,
      url: baseUrl + req.api,
      headers: req.header ? req.header : this.getHeader(),
      body: JSON.stringify(req.body)
    });

    const res = await this.http.request(new Request(requestOptions)).toPromise();

    return res;
  };
}
