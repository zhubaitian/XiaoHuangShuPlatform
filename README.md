# 第四章 登录服务的实现

上一章我们重新定制了登录页面，且学习了angularjs通过模型驱动表单，更好的对表单以及表单下面的控件进行控制。

这一章我们会开始动手写代码，实现小黄书管理平台的登录功能。其中涉及以下几个点:

- 支持es6 async/await特性
- 使用Logger
- 实现promisify化的HTTP请求服务
- 实现登录服务
- 调用登录服务进行登录

# 1. 支持es6 async/await特性
---
ES6增加了很多很好的特性方便我们更快更好的编写JS代码，比如async/await就能让我们很好的避免回调地狱(callback hell)。

ng2-admin默认没有支持上es6，所以我们需要对TypeScript做一些配置上面的修改，让其支持上es6。

我们项目中的TypeScript配置文件是项目根目录下的tsconfig.webpack.json，我们先看下期中的编译选项:
``` json
  "compilerOptions": {
    "target": "es5",
    "module": "es2015",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "noEmit": true,
    "noEmitHelpers": true,
    "strictNullChecks": false,
    "lib": [
      "es2015",
      "dom"
    ],
    "typeRoots": [
      "node_modules/@types"
    ]
  },
```

我们可以看到里面并没有提供对es6的支持，所以，我们需要修改如下:

``` json
  "compilerOptions": {
    "declaration": false,
    "target": "es6",
    "module": "commonjs",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "suppressImplicitAnyIndexErrors": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "noEmit": true,
    "noEmitHelpers": true,
    "strictNullChecks": false,
    "lib": [
      "es6",
      "dom"
    ],
    "typeRoots": [
      "node_modules/@types"
    ]
  },
```

然后重新运行npm start进行编译和运行，编译和运行没有问题的话，代表es6已经可以支持上，我们就可以在实现代码时通过es6的方式来实现了。

# 2. 使用Logger
---
平时，我们贪图调试的方便，往往直接就console.log进行打印。但是在真实项目中，我们往往需要更好的日记库来做更好的记录日记。比如angular2-logger就是一个很不错的库，可以让我们很简单的记录不同层级的日记。

https://github.com/code-chunks/angular2-logger

首先我们需要安装：

``` shell
npm install --save angular2-logger
```

因为我们在整个应用上都会用到这个logger，所以我们在app.module.js中，引入这个logger模块。

``` js
import {DEBUG_LOGGER_PROVIDERS} from "angular2-logger/core"; //DEBUG LEVEL以上的信息都打印出来
...
@NgModule({
  bootstrap: [App],
  declarations: [
    App
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    HttpModule,
    RouterModule,
    CookieModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    NgbModule.forRoot(),
    PagesModule,
    routing
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    DEBUG_LOGGER_PROVIDERS,
    HttpService
  ]
})

export class AppModule {
  ...
}
```

这里我们直接从angular2-logger/core中import的是DEBUG_LOGGER_PROVIDERS这个provider，目的是让运行时的应用把所有通过logger打印出来的DEBUG层级以上的日记都打印出来。

这里有多个providers可以选择

``` js
  ERROR_LOGGER_PROVIDERS
  WARN_LOGGER_PROVIDERS
  INFO_LOGGER_PROVIDERS
  DEBUG_LOGGER_PROVIDERS
  LOG_LOGGER_PROVIDERS
  OFF_LOGGER_PROVIDERS
```

最后，我们就可以像下面这个例子那样通过这个日记服务来写log了:

``` js

import { Logger } from "angular2-logger/core";
...
 @Component({
 	...
 })
 export class AppComponent(){
 	constructor( private _logger: Logger ){
 		this._logger.error('This is a priority level 1 error message...');
 		this._logger.warn('This is a priority level 2 warning message...');
 		this._logger.info('This is a priority level 3 warning message...');
 		this._logger.debug('This is a priority level 4 debug message...');
 		this._logger.log('This is a priority level 5 log message...');
 	}
 }
```

# 3. 实现promisify化的HTTP请求服务
---

“@angular/http”库提供了很多模块让我们去实现HTTP请求。但是，我们如果每次调用一个请求的时候都需要重复的去整理各种请求参数选项，然后再发出对应的请求，代码会有太多的冗余，不利于扩展。

所以，我们需要将HTTP请求进行进一步封装，封装成一个简单的request调用API。

毕竟，我们在请求一个RESTFUL API时，变化的往往只是:

- 请求类型. 是POST还是GET等
- 请求哪个API
- 请求参数

当前我们先不考虑url中带有querystring参数的情况，先考虑数据参数都是通过body进行传输的情况。

实现代码如下:

``` js
/**
 * Created by kevinzhu on 03/05/2017.
 */

import {Injectable, Inject} from '@angular/core';
import {Http, Response, RequestOptions, Request, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';

const APIURL = 'http://localhost:3000/v1';

@Injectable()
export class HttpService {
  constructor(private http: Http){}

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

    return await this.http.request(new Request(requestOptions)).toPromise();

  };
}

```

可以看到代码里面用到了好几个es6的特性，比如async/awai方法，让我们的代码更简洁。

代码的大概意思就是：
- 设置我们的请求要发往的URL
- 在服务的构造函数中注入Http服务， 我们在app.module.ts中已经注入HttpModule模块，所以我们这里可以直接使用
- 封装一个getHeader方法来设置HTTP请求的头，设置发送内容类型为json格式
- 实现request请求api：注意方法里面的async，代表这是一个异步调用。调用者可以在调用该函数时前面加上await来等待该函数在执行完成后返回。且返回应该是一个promise对象。
  - 配置Http请求选项RequestOptions：
    - method： 请求方式'POST'等，调用者调用request方法时需要提供该参数
    - url： 请求API的目标地址
    - header：HTTP头，调用者有提供的话就用调用者提供的，没有的话就通过上面的getHeader来获取
    - body：发送给服务器端的请求参数，一般在POST中会用到
  - 通过调用http.request方法来发送请求到服务器。注意这里使用了rxjs库的toPromise方法，将http.request请求promisify化，这样我们就可以结合await来等待请求的完成，再将一个promise对象返回给上层调用函数。

这里的rxjs据说是一个很强大的库，我个人是没有什么研究。暂时只是知道有这个用法而已，其他的今后看情况研究吧。

## 4.1 实现登录服务
---
和我们实现HTTP的服务的原因一样，为了方便调用，我们需要对登录相关的API封装成一个服务，比如login，logout等。

## 4.1. 注入HttpService和Logger服务

首先，我们在loginService中的构造函数中注入了我们上面实现的httpService服务和Logger，我们在app.module.ts中已经在Provider中引入了这些服务。

``` js
/**
 * Created by KevinZhu on 03/05/2017.
 */

import { Injectable }    from '@angular/core';
import { HttpService } from '../../http.service';
import { Logger } from "angular2-logger/core";

@Injectable()
export class LoginService {

  private logoutApi = '/auth/logout';  // URL to web api
  private loginApi = '/auth/login';

  constructor(private httpService: HttpService,
              private log: Logger) { };

  ...
}
```

同时，我们定义了两个api，我们在登录和登出的时候，需要作为参数来传给httpService的request，这个函数我们在上面已经看过。

## 4.2. 实现登录API

注入了httpService服务之后，我们就可以调用其提供的request方法来和服务器进行交互了，比如，进行login操作。

和request这个方法对应，我们的login也需要使用async这个关键字，这样我们才能在调用request方法前使用await来等待其返回。

``` js
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

    return response;
  }
```
- login方法接收两个参数，就是我们登录用的用户名和密码
- 我们需要将这两个参数和user_type一起，组合成一个数据结构来作为body发送给小黄书后台服务器的login接口。如果不解的这个接口的实现的，请查看前面小黄书服务器相关的章节
- 最后我们按照request方法的参数要求，将登陆请求通过调用request方法来进行登录操作
- 最后将登陆的promisify化的结果，返回给调用者。我们会在login.componet.js中对login这个接口进行调用，然后进一步处理返回的结果。

## 4.3. 将访问凭证保存到cookie中

登录之后，我们将会获得访问凭证access_token。我们需要将其保存到cookie中，以便今后其他服务进行调用。

所以我们需要注入在app.module.ts中登记的CookieService服务，然后从登录返回结果中取出访问凭证，并保存到cookie中。

``` js
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
...
}
```
在获取到访问凭证之后，我们会调用cookieService.put的方法将访问凭证保存到cookie中。

同时，为了验证结果，我们会使用cookieService.get方法将上面保存的访问凭证取出来，并打印出来进行验证。

## 4.4. 登出

有登录，必然就有登出。我们会在登录服务的实现文件中，将登录方法一并给封装起来。

``` js
  async logout(): Promise<any> {
    const response = await this.httpService.request({method: 'POST', api: this.logoutApi});
    this.log.debug('response:',response);
    this.cookieService.remove("access_token");
    return response;
  }
```
在登出之后，我们需要同时通过cookeService.remove方法，将login时保存的access_token给从cookie中删除掉。

# 5. 通过登录页面进行登录
---

实现了登录服务之后，我们就可以轻松的在login.component.ts中，调用登录服务提供的方法来进行登录了。

但是，开始之前我们先要了解下angular2-toaster这个库。因为我们需要用它，来再我们登录失败时显示相应的一些提示。

## 5.1. 使用Toaster

详细使用方式，请查看官方README：
https://github.com/stabzs/Angular2-Toaster

### 5.1.1 安装依赖包

根据文档的描述，使用Angular2-Toaster的前提是，必须先安装animations的支持。且，经过实践，我们必须指定4.01的版本。

``` shell
npm install @angular/animations@4.0.1 --save
```
同时，安装Angular2-Toaster:

``` shell
npm install angular2-toaster --save
```

### 5.1.2. 引入BrowserAnimations模块

安装完“@angular/animations”模块之后，我们要在根模块app.module.ts中将BrowserAnimationsModule给import进来。

``` js
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
...

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [App],
  declarations: [
    App
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    RouterModule,
    CookieModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    NgbModule.forRoot(),
    PagesModule,
    // ToasterModule,
    routing
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    DEBUG_LOGGER_PROVIDERS,
    HttpService,
    // ToasterService
  ]
})

export class AppModule {
  ...
}
```

### 5.1.3. 引入ToasterModule模块

同理，我们需要将ToasterModule模块引入进来给我们的login.component.ts使用。但是我们不是在app.module.ts中引入，而是在login.module.ts中引入（我也不知道为什么不能再根模块中引入，只是知道在里面引入的话代码就会跑不起来。希望知道的童鞋指点下）。

``` js
import {ToasterModule} from 'angular2-toaster';
...

@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    ToasterModule,
    routing
  ],
  declarations: [
    Login
  ],
  providers: [
    LoginService,
  ]
})
export class LoginModule {}
```

### 5.1.4 在登录页面模板中添加Toaster显示位置

因为要在登录页面显示Toaster信息，所以，根据文档，我们必须要在页面模板中加入toaster-container的标签。

我们修改login.html这个页面模板，在登录表单的下面显示Toaster信息。

``` html
<div class="auth-main">
  <div class="auth-block">
    <h1 translate>{{'login.title'}}</h1>

    <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)" class="form-horizontal">
      <div class="form-group row" [ngClass]="{'has-error': (!user.valid && user.touched), 'has-success': (user.valid && user.touched)}">
        <label for="inputUser3" class="col-sm-2 control-label" translate>{{'login.user'}}</label>

        <div class="col-sm-10">
          <input [formControl]="user" type="text" class="form-control" id="inputUser3" placeholder="{{'login.user' | translate}}">
        </div>
      </div>
      <div class="form-group row" [ngClass]="{'has-error': (!password.valid && password.touched), 'has-success': (password.valid && password.touched)}">
        <label for="inputPassword3" class="col-sm-2 control-label" translate>{{'login.password'}}</label>

        <div class="col-sm-10">
          <input [formControl]="password" type="password" class="form-control" id="inputPassword3" placeholder="{{'login.password' | translate}}">
        </div>
      </div>
      <div class="form-group row">
        <div class="text-center col-sm-10">
          <button [disabled]="!form.valid" type="submit" class="btn btn-default btn-auth" translate>{{'login.sign_in'}}</button>
        </div>
      </div>

    </form>
    
    <toaster-container></toaster-container>


  </div>
</div>

```

# 5.1.5 实现登录

这里贴出整个login.component.ts的代码。其实我们前面的章节在分析表单的时候已经看过部分代码，特别是在构造函数中使用FormBuilder来实现模型表单的分析。

这里我们更多是关注到在用户点击提交按钮时的交互，也就是onSubmit这个方法的实现。

``` js
import {Component} from '@angular/core';
import {FormGroup,FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { LoginService } from './login.service';
import { Logger } from "angular2-logger/core";
import {ToasterContainerComponent, ToasterService, ToasterConfig, Toast} from 'angular2-toaster';

import 'style-loader!./login.scss';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  directives: [ToasterContainerComponent],
})
export class Login {

  public form:FormGroup;
  public user:AbstractControl;
  public password:AbstractControl;
  public submitted:boolean = false;
  private toasterService: ToasterService;

  constructor(fb:FormBuilder,
              private loginService: LoginService,
              private toasterService: ToasterService,
              private log: Logger) {
    this.form = fb.group({
      'user': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.toasterService = toasterService;
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

```

- 构造函数的改动主要是增加了其他服务的注入，比如LoginService和ToasterService。
- 因为我们需要在login.html中用到toaster-container这个指定，所以在Component修饰器中，我们需要引入ToasterContainerComponent这个directive指令
- 当用户点击提交按钮的时候，代码就会调用登录服务的login接口，将用户名和密码作为参数传过去。登录成功后，将页面导航到dashboard页面
- 登录失败的时候，通过ToasterService，将失败提示信息显示到登录表单下方，并且希望在10秒后自动消失。

![image.png](http://upload-images.jianshu.io/upload_images/264714-fad5ae235e52a3e6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 5.1.6. 修改Toaster显示

在上面的错误提示中，文字显示是白色的。但是我们希望在类型为error的Toaster信息中，文字的显示颜色是红色的。在其他类型Toaster信息中，也希望有不同的颜色显示。

所以，我们需要在css文件中，对Toaster的显示颜色进行配置。

以下是在login.scss中修改后的代码。这些修改都是google出来的，相信够用：

``` css
@import '../../theme/sass/auth';

#toast-container > .toast-success {
  color: #3c763d;
  background-color: #dff0d8;
  border-color: #d6e9c6;
}
.toast-success .toast-close-button {
  color: #3c763d;

}#toast-container > .toast-info {
   color: #31708f;
   background-color: #d9edf7;
   border-color: #bce8f1;
 }
.toast-info .toast-close-button {
  color: #31708f;

}#toast-container > .toast-warning {
   color: #8a6d3b;
   background-color: #fcf8e3;
   border-color: #faebcc;
 }
.toast-warning .toast-close-button {
  color: #8a6d3b;
}

#toast-container > .toast-error {
  color: #a94442;
  background-color: #f2dede;
  border-color: #ebccd1;
}
.toast-error .toast-close-button {
  color: #a94442;
}

.toaster-icon {
  filter: invert(0.5);
}
#toast-container > div {
  opacity: 1;
  border: 1px solid transparent;
  border-radius: 4px;
}

```

这时，如果输入的用户名或者密码不对的话，提示Toaster就会变成红色了。

![image.png](http://upload-images.jianshu.io/upload_images/264714-b72204518f7694a2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 6. 结语
---

详细实现请查看github中的代码。
-  git clone https://github.com/zhubaitian/XiaoHuangShuPlatform.git
- cd XiaoHuangShuPlatform/
- git checkout CH03

运行:
> - npm install
- npm start

---
>本文由天地会珠海分舵编写，转载需授权，喜欢点个赞，吐槽请评论，进一步交流请关注公众号**techgogogo**或者直接联系本人微信**zhubaitian1**
