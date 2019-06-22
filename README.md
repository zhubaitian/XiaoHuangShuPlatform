# 第三章 登录页面和模型驱动表单

上一章我们对小黄书管理平台实现了中文国际化的支持，让我们的管理平台可以根据浏览器当前的语言来自动显示中文或者英文。

本章我们计划开始看下ng2-admin的登录页面：

- 如何通过Formbuilder来实现模型驱动表单的，

- 并会对登录页面进行些修改，修改成适合我们小黄书管理平台的登录页面。

![Login_cn.jpeg](http://upload-images.jianshu.io/upload_images/264714-c81c14d159818281.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 1. 登录页面表单处理
---

## 1.1. 模型驱动表单 vs 模板驱动表单
在Angular中，我们可以通过两种方法来构建表单。

- 一种是模板驱动表单’(Template-Driven Froms)。使用Angular的页面模板语法，结合表单专用指令和技术来构建表单。

  顾名思义，模板驱动的表单就是大部分表单相关代码都在模板里，通过在模板里面添加ngForm, ngModel和ngModelGroup等属性来定义模板和验证信息，以及它跟组件之间的数据交互。 详情请查看官网的这篇文章：https://angular.cn/docs/ts/latest/guide/forms.html

- 一种是模型驱动表单(Model-Driven/Reactive Forms)。在我们的模板中使用指令给我们没有太多的样板快速原型的能力，我们被束缚住了。 相反，响应式表单，让我们通过代码定义我们的形式，并给我们对数据验证更多的灵活性和控制。

  >虽然模板驱动的表单使用起来很方便，但是，当你的表单变得越来越复杂，特别是控件之间存在很多数据的交互，例如很常见的购物车，购物车里面会有很多商品，如果是类似淘宝这样的网站，这些商品还需要按照店铺分组；每个商品有单价和数量，每个店铺甚至每个商品可能有一些优惠券可以使用，甚至会有淘宝平台的减满券；当每个商品的单价或数量改变的时候，每个店铺的商品总金额、和总金额都会发生改变。像这种复杂的表单，数据之间的交互非常多，对开发和测试都会非常不方便。如果使用模板驱动的表单，测试是基于浏览器的端对端测试，测试用例也很不好写。对于这种情况，使用Angular2的另一种表单，也就是模型驱动的表单(Model-Driven Forms)会更加方便。

  下面这篇文章是个很好的入门示例：http://codin.im/2016/09/29/angular2-form-model-driven/

## 1.2. 登录页面模型驱动表单

ng2-admin的登录页面是通过模型驱动表单来实现对表单的控制的。下面就是login.component.ts页面的代码:

``` js
import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';

import 'style-loader!./login.scss';

@Component({
  selector: 'login',
  templateUrl: './login.html',
})
export class Login {

  public form:FormGroup;
  public email:AbstractControl;
  public password:AbstractControl;
  public submitted:boolean = false;

  constructor(fb:FormBuilder) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  public onSubmit(values:Object):void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      // console.log(values);
    }
  }
}

```

- FormBuilder的目的是方便我们为我们创建一个Form表单以及下面的FormControl控件。也就是说，我们并不是必须要用FormBuilder来进行表单创建的。比如，我们可以将上面的fb.group方法创建表单及表单下的控件的代码改成直接用FormGroup来进行创建，效果是一样的:
  ``` js
   this.form = new FormGroup( {
      email: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]))
    })
  ```

- 通过FormBuilder实例的group方法创建好一个Form和属于这个表单的FormControls之后，将其赋予给登录组件的form成员变量，我们就可以在页面模板中通过[formGroup]="form"来将这个表单实例绑定到页面的表单元素中，从而可以在页面模板的其他地方对该实例进行引用。
``` html
    <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)" class="form-horizontal">
      ...
      <div class="form-group row">
        <div class="offset-sm-2 col-sm-10">
          <button [disabled]="!form.valid" type="submit" class="btn btn-default btn-auth" translate>{{'login.sign_in'}}</button>
          <a routerLink="/login" class="forgot-pass" translate>{{'login.forgot_password'}}</a>
        </div>
      </div>
    </form>
```

- 我们可以通过FormControl实例的controls属性来获取到对一个Form下面的FormControl的实例引用，这样，我们就可以在页面模板中通过[formControl]指令绑定该变量来对在页面中对该实例进行操作。比如email变量的绑定：
``` html
  <div class="col-sm-10">
          <input [formControl]="email" type="email" class="form-control" id="inputEmail3" placeholder="{{'login.email' | translate}}">
</div>
```

- Validators是应用在FormControl表单控件中用来验证输入有效性的。当所有表单控件的输入都是有效的时候，表单实例form.valid才会返回true。页面模板就是这样来判断该表单下的email和password输入是否有效来enable或者disable提交按钮的:
``` html
<div class="form-group row">
        <div class="offset-sm-2 col-sm-10">
          <button [disabled]="!form.valid" type="submit" class="btn btn-default btn-auth" translate>{{'login.sign_in'}}</button>
          <a routerLink="/login" class="forgot-pass" translate>{{'login.forgot_password'}}</a>
        </div>
```

完整的页面模板代码如下:

``` html
<div class="auth-main">
  <div class="auth-block">
    <h1 translate>{{'login.title'}}</h1>
    <a routerLink="/register" class="auth-link" translate>{{'login.signup_link'}}</a>

    <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)" class="form-horizontal">
      <div class="form-group row" [ngClass]="{'has-error': (!email.valid && email.touched), 'has-success': (email.valid && email.touched)}">
        <label for="inputEmail3" class="col-sm-2 control-label" translate>{{'login.email'}}</label>

        <div class="col-sm-10">
          <input [formControl]="email" type="email" class="form-control" id="inputEmail3" placeholder="{{'login.email' | translate}}">
        </div>
      </div>
      <div class="form-group row" [ngClass]="{'has-error': (!password.valid && password.touched), 'has-success': (password.valid && password.touched)}">
        <label for="inputPassword3" class="col-sm-2 control-label" translate>{{'login.password'}}</label>

        <div class="col-sm-10">
          <input [formControl]="password" type="password" class="form-control" id="inputPassword3" placeholder="{{'login.password' | translate}}">
        </div>
      </div>
      <div class="form-group row">
        <div class="offset-sm-2 col-sm-10">
          <button [disabled]="!form.valid" type="submit" class="btn btn-default btn-auth" translate>{{'login.sign_in'}}</button>
          <a routerLink="/login" class="forgot-pass" translate>{{'login.forgot_password'}}</a>
        </div>
      </div>
    </form>

    <div class="auth-sep"><span><span translate>{{'login.sign_from_app_text'}}</span></span></div>

    <div class="al-share-auth">
      <ul class="al-share clearfix">
        <li><i class="socicon socicon-facebook" title="{{'login.share_on_facebook' | translate}}"></i></li>
        <li><i class="socicon socicon-twitter" title="{{'login.share_on_twitter' | translate}}"></i></li>
        <li><i class="socicon socicon-google" title="{{'login.share_on_google_plus' | translate}}"></i></li>
      </ul>
    </div>
  </div>
</div>

```

# 2. 小黄书登录页面定制
---

ng2-admin的登录页面模板有些多余的元素不是我们想要的，比如facebook分享等。所以，我们最后会对login.html这个页面进行下修改:

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
        <div class="offset-sm-10 col-sm-10">
          <button [disabled]="!form.valid" type="submit" class="btn btn-default btn-auth" translate>{{'login.sign_in'}}</button>
        </div>
      </div>
    </form>

  </div>
</div>

```

同时，我们登录时使用的是用户名而不是email，所以我们需要一并进行修改。对应的login.componet.ts中绑定的email这个FormControl变量也需要改成user：

``` js
export class Login {

  public form:FormGroup;
  public user:AbstractControl;
  public password:AbstractControl;
  public submitted:boolean = false;

  constructor(fb:FormBuilder) {
    this.form = fb.group({
      'user': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.user = this.form.controls['user'];
    this.password = this.form.controls['password'];
  }

  public onSubmit(values:Object):void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      // console.log(values);
    }
  }
}
```

最后，国际化文件中对应的项也需要进行更新，已达到下面的效果。代码我就不列出来了。

![Login_new.jpg](http://upload-images.jianshu.io/upload_images/264714-22b43b4b5fea8bbf.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


# 3. 结语
---

详细实现请查看github中的代码。
-  git clone https://github.com/zhubaitian/XiaoHuangShuPlatform.git
- cd XiaoHuangShuPlatform/
- git checkout CH02

运行:
> - npm install
- npm start

---
>本文由天地会珠海分舵编写，转载需授权，喜欢点个赞，吐槽请评论，进一步交流请关注公众号**techgogogo**或者直接联系本人微信**zhubaitian1**
