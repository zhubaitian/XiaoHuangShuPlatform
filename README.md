# 第一章 Angularjs2.0基础及ng2-admin概览

上一章我们实现了小黄书小程序的微信授权登录。往下我们打算实现小黄书管理平台端的登录授权操作，毕竟，小黄书后台很早就已经实现了管理员的管理和登录授权逻辑。

小黄书的管理后台我们打算使用Angularjs 2.0的技术来实现，因为笔者自身也是个小白，所以会在学习过程中谈及很多基础的知识。

同时，我们不会从零开始对小黄书的后台进行构建。这样太耗时了，现实中，我们往往是基于一些收费的或者是免费的模板开始的。

# 1. Angularjs 2.0基础
---
Angularjs 2.0的基础知识，本人建议直接看官方的开发指南：
https://angular.cn/docs/ts/latest/guide/

如果前期投入时间不多的话，那么我觉得可以先看介绍Angularjs 2.0架构和重要模块描述的这篇文章：
https://angular.cn/docs/ts/latest/guide/architecture.html

大家之前没有学过Angularjs 2.0的话，本人认为这篇文章是必读的。否则，就算你参照现有的模板，也很难实现任何功能。


# 2. ng2-admin模板简介
---

小黄书的整个管理后台我们会基于网上的模板来实现。因为网上的大部分模板，无论是付费的还是免费的，都已经帮我们把很多基础设施给搭建好了，这样，我们就不需要做一些重新造轮子的事情了。

比如我们这里选择的[ng2-admin](https://github.com/akveo/ng2-admin)模板，它已经帮我们搭建好了如下的一些基础设施:

- 基于webpack的构建脚本
- 自适应布局
- 基于bootstrap 4的css框架
- 各种控件的bootstrap样式使用示例
- 通过热更新HMR来方便我们调试开发
- 基础页面。比如登录页面
- 等等...

大家可以到[ng2-admin示例网站](http://akveo.com/ng2-admin)进行体验。

基于webpack的模板代码，我已经放了一份在github上面：
https://github.com/zhubaitian/XiaoHuangShuPlatform.git
大家直接克隆master分支就好了。我们往后的修改就是基于这份代码的基础上进行的。

## 2.1. 代码组织结构及职责概览

![代码结构.jpeg](http://upload-images.jianshu.io/upload_images/264714-aa3b4dd123004b89.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

以上是ng2-admin的代码组织结构, 从职责和代码组织结构上来分大体分为三层：

- **第一层 - 应用根模块**：由src/app/app.xxx.ts这些文件组成，相当于ng2-admin应用的入口模块。
  - app.component.ts：根组件，直接挂载到index.html的app标签上面。所有其他子组件和孙组件都会在该挂载点上进行插入展开，所以根组件相当于是装载所有子孙组件的容器。
  - app.routing.ts：根路由。ng2的router是一个独立的module库，我们可以通过该库来定义我们的路由。比如可以在这里定义我们访问根路由http://localhost:3001 时该如何跳转。
  - app.module.ts: 根模块。模块的主要的目的就是将需要用到service，module，component，directive，routing等给整合在一起形成独立的一个模块，同时可以将这个模块export出去给别的模块使用。

- **第二层 - 页面框架层**： 由src/app/pages/pages.xxx.ts这些文件组成，主要是实现一个包含菜单栏，footer等的页面框架，如此一来，第三层的视图只需要嵌入到这个框架中就能共享菜单栏等
  - pages.component.ts: 页面框架容器视图。
  - pages.routing.js: 二级路由pages下的三级路由定义。比如http://localhost:3001/#/login 和 http://localhost:3001/#/pages/dashboard 
  - pages.menu.ts: 左边菜单栏的定义
  - app.module.ts：pages模块。主要功能是将pages视图，需要用到的服务和第三方模块等进行模块化。

- **第三层 - 页面内容层**： 由src/app/pages下面的各个文件夹组成，主要是对pages框架内的一个页面的实现，比如dashboard页面。也有例外，比如login和register页面是不在pages框架内的，因为还没有登录，所以不需要有pages框架的菜单栏等。以login为例：
  - login.component.ts: 登录视图组件。
  - login.html: 登录视图模板。
  - login.routing.ts: 登录子路由。事实上只有一个login，即 http://localhost:3001/#/login
  - login.module.ts: 登录模块。主要功能是将登录视图，需要用到的服务和第三方模块等进行模块化。

## 2.2. index.html 和 NG2应用挂载点

src/index.html是最上层的页面模板。里面的<app></app>两个标签就是下面的根组件挂载的地方，也就是整个ng2-admin应用开始的位置。

``` html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title><%= htmlWebpackPlugin.options.title %></title>

  <meta name="description" content="<%= htmlWebpackPlugin.options.metadata.description %>">

  <% if (webpackConfig.htmlElements.headTags) { %>
  <!-- Configured Head Tags  -->
  <%= webpackConfig.htmlElements.headTags %>
  <% } %>

  <!-- base url -->
  <base href="<%= htmlWebpackPlugin.options.metadata.baseUrl %>">


</head>

<body>
<app>
</app>

<div id="preloader">
  <div></div>
</div>

<% if (htmlWebpackPlugin.options.metadata.isDevServer && htmlWebpackPlugin.options.metadata.HMR !== true) { %>
<!-- Webpack Dev Server reload -->
<script src="/webpack-dev-server.js"></script>
<% } %>

</body>
</html>
 ```

同时，这个文件也是我们对网站进行访问时候的入口，只是它不是静态的页面，而是根据app标签下面的内容动态调整的。

## 2.3. 第一层-应用根模块
src/app下面app.xxx.ts文件组成了这个ng2应用的根模块。

### 2.3.1. 挂载根组件

我们可以看到入口组件app.component.ts中指定的挂载点就是index.html的app标签。

``` js

@Component({
  selector: 'app',
  template: `
    <main [ngClass]="{'menu-collapsed': isMenuCollapsed}" baThemeRun>
      <div class="additional-bg"></div>
      <router-outlet></router-outlet>
    </main>
  `
})

export class App {
  ...
}
```

### 2.3.2. router-outlet

这里还要注意app.component.ts的页面模板里面的router-outlet标签，它代表了子路由的占位符。 

以ng2-admin为例，二级路由分别有:

- http://localhost:3001/pages
- http://localhost:3001/login
- http://localhost:3001/register

这些都是在第二层的src/app/pages/pages.routing.js中进行定义的:

``` js
import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule' },
      { path: 'editors', loadChildren: 'app/pages/editors/editors.module#EditorsModule' },
      { path: 'components', loadChildren: 'app/pages/components/components.module#ComponentsModule' },
      { path: 'charts', loadChildren: 'app/pages/charts/charts.module#ChartsModule' },
      { path: 'ui', loadChildren: 'app/pages/ui/ui.module#UiModule' },
      { path: 'forms', loadChildren: 'app/pages/forms/forms.module#FormsModule' },
      { path: 'tables', loadChildren: 'app/pages/tables/tables.module#TablesModule' },
      { path: 'maps', loadChildren: 'app/pages/maps/maps.module#MapsModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

```
当我们访问其中一个二级路由时，该路由对应的组件就会在父组件(即这里的根组件)router-outlet标签下面进行插入。

比如访问http://localhost:3001/login 时，在router-outlet下面将会插入login这个二级路由关联的登录组件：

![router-outlet_login.jpg](http://upload-images.jianshu.io/upload_images/264714-1657dff44e790e91.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

访问http://localhost:3001/register 时，在router-outlet下面将会插入register这个二级路由关联的注册组件:

![router-outlet_register.jpg](http://upload-images.jianshu.io/upload_images/264714-1c97d4b8560b9519.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

当访问http://localhost:3001/pages 时，根据上面pages.routing.js的二级路由的定义， 会直接跳到http://localhost:3001/pages/dashboard 中:

``` js
 {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ...
    ]
  }
```

此时的router-outlet下面插入的将会是pages对应的组件:

![router-outlet_pages-dashboard.jpg](http://upload-images.jianshu.io/upload_images/264714-f95ec63047b311c3.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

同时，我们看到在pages组件下面，还有一个router-outlet，而下面插入的就是我们的dashboard对应的组件。这时我们就要查看dashboard这个三级路由的父组件pages组件pages.component.ts的代码了:

``` js
import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';

@Component({
  selector: 'pages',
  template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix">
      <div class="al-footer-right" translate>{{'general.created_with'}} <i class="ion-heart"></i></div>
      <div class="al-footer-main clearfix">
        <div class="al-copy">© <a href="http://akveo.com" translate>{{'general.akveo'}}</a> 2016</div>
        <ul class="al-share clearfix">
          <li><i class="socicon socicon-facebook"></i></li>
          <li><i class="socicon socicon-twitter"></i></li>
          <li><i class="socicon socicon-google"></i></li>
          <li><i class="socicon socicon-github"></i></li>
        </ul>
      </div>
    </footer>
    <ba-back-top position="200"></ba-back-top>
    `
})
export class Pages {

  constructor(private _menuService: BaMenuService,) {
  }

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
  }
}

```
原理和根组件的router-outlet是一样的。对于根组件，访问http://localhost:3001/xxx 时，对应的组件会插入到根组件的router-ouetlet组件下面；对于pages组件，访问http://localhost:3001/pages/xxx 时，对应的组件会插入到pages组件中的router-outlet里面，如此类推。
 
### 2.3.3. 根路由注册和Hash格式URL

src/app/app.rounting.js定义了应用的上层路由:

``` js
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages/dashboard' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });

```
其中定义了一个路由数组，包含了了两个路由路径：

- 如果直接访问网站的域名，比如访问http://localhost:3001， 那么直接跳到http://localhost:3001/pages 页面(配合下面的路由，最终将会重定向到dashboard页面)
- 如果访问任何其他页面（没有和其他子路由匹配）子路由，都会被重定向到http://localhost:3001/pages/dashboard 页面（但如果是http://localhost:3001/login 路由，则不会跳转，因为Login模块定义了 login这个子路由）

最后将这个路由数组传入到RouterModule.forRoot来注册我们的路由并export出去给module使用。需要注意的是：

> 只在根模块路由中调用RouterModule.forRoot。 在其它子功能模块中，我们必须调用RouterModule.forChild方法来注册附属路由。

同时，我们可以在根模块的RouterModule.forRoot的第二个参数中传入一个带有useHash: true的对象，实现hash的url访问方式。如访问login时请注意中间的井号: http://localhost:3001/#/login。

### 2.3.4. 根模块和NgModule装饰器的关键属性

每一个ng2应用都有一个根模块，通常叫做AppModule。如上所述，模块的主要的目的就是将需要用到service，module，component，directive，routing等给整合在一起形成独立的一个模块，同时可以将这个模块export出去给别的模块使用。

>此外，根模块还有另外一个职责，就是通过在NgModule修饰器设置bootstrap选项来设置引导组件，也就是我们的根组件。它是所有其它视图的宿主。只有根模块才能设置bootstrap属性

``` js
import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { routing } from './app.routing';

// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';


// Application wide providers
const APP_PROVIDERS = [
  AppState,
  GlobalState
];

export type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};
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
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    NgbModule.forRoot(),
    PagesModule,
    routing
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})

export class AppModule {
  ...
}
```

以下是在上面提到的官方给出的Angularjs 2.0架构文章的基础上，对这段代码的解析：
>Angular 模块（无论是*根模块*还是*特性模块*）都是一个带有@NgModule装饰器的类。
  >>装饰器是用来修饰 JavaScript 类的函数。 Angular 有很多装饰器，它们负责把元数据附加到类上，以了解那些类的设计意图以及它们应如何工作。 关于装饰器的[更多信息](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.x5c2ndtx0)。

>NgModule
是一个装饰器函数，它接收一个用来描述模块属性的元数据对象。

- **bootstrap**: 指定应用的主视图（称为*根组件*），它是所有其它视图的宿主。只有*根模块*才能设置bootstrap属性。

- **declarations**: 声明本模块中拥有的*视图类*。Angular 有三种视图类：[组件](https://angular.cn/docs/ts/latest/guide/architecture.html#components)、[指令](https://angular.cn/docs/ts/latest/guide/architecture.html#directives)和[管道](https://angular.cn/docs/ts/latest/guide/pipes.html)。当在当前模块中需要用到其他component时，我们就需要在本模块的declarations中列出这些模块出来

- **exports**: declarations 的子集，可用于其它模块的组件模板。因为根模块不会从属于任何其他模块来被他人引用，所以我们这里不需要设置任何exports

- **imports**: 本模块声明的组件模板需要用到的类所在的其它模块。比如我们在app.component.ts的模板中需要用到“[ngClass]”来动态设置class属性，所以我们需要引入BrowserModule模块。同时也用到了router-outlet指令，所以需要引入RouterModule模块。 
``` js
/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  template: `
    <main [ngClass]="{'menu-collapsed': isMenuCollapsed}" baThemeRun>
      <div class="additional-bg"></div>
      <router-outlet></router-outlet>
    </main>
  `
})
export class App {
  ...
}
```

- **providers**: 需要用到的service列表。注意，加入到providers中的service会被加入到全局服务列表中，可用于应用任何部分。也就是说，如果在子模块的providers中加入一个service，那么这个service在任何其他模块中都能使用。

## 2.4. 第二层 - 页面框架层

由src/app/pages/pages.xxx.ts这些文件组成，主要是实现一个包含菜单栏，footer等的页面框架，如此一来，第三层的视图只需要嵌入到这个框架中就能共享菜单栏等

### 2.4.1. 页面框架视图模板

src/app/pages/pages.component.ts定义了页面框架视图：

``` js
import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';

@Component({
  selector: 'pages',
  template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix">
      <div class="al-footer-right" translate>{{'general.created_with'}} <i class="ion-heart"></i></div>
      <div class="al-footer-main clearfix">
        <div class="al-copy">© <a href="http://akveo.com" translate>{{'general.akveo'}}</a> 2016</div>
        <ul class="al-share clearfix">
          <li><i class="socicon socicon-facebook"></i></li>
          <li><i class="socicon socicon-twitter"></i></li>
          <li><i class="socicon socicon-google"></i></li>
          <li><i class="socicon socicon-github"></i></li>
        </ul>
      </div>
    </footer>
    <ba-back-top position="200"></ba-back-top>
    `
})
export class Pages {
  constructor(private _menuService: BaMenuService,) {
  }

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
  }
}

```

在该页面组件的模板中，定义了整个页面的框架，其中用到的一些结构性directives是通过引入nga.module.ts来获得的。

在nga.module.ts中，引入了以下这些components:

``` js
const NGA_COMPONENTS = [
  BaAmChart,
  BaBackTop,
  BaCard,
  BaChartistChart,
  BaCheckbox,
  BaContentTop,
  BaFullCalendar,
  BaMenuItem,
  BaMenu,
  BaMsgCenter,
  BaMultiCheckbox,
  BaPageTop,
  BaPictureUploader,
  BaSidebar,
  BaFileUploader
];


@NgModule({
  declarations: [
    ...NGA_COMPONENTS
  ],
})
```
注意declarations中NGA_COMPONENTS数组前面使用了三个点...，代表是对数组展开，这依稀记得好像是es6的语法吧。

我们在pages.component.ts中用到的视图有：
- **ba-sidebar**: 页面框架左边的菜单栏
- **ba-page-top**：页面框架上面的浮动标题栏
- **ba-content-top**：浮动标题栏下方的页面内容标题
- **ba-back-top**：页面框架右下角的返回上层按钮

同时，在ba-content-top下方，使用了router-outlet标签。所以所有第三层的视图豆浆从内容标题栏下面开始填充。

![页面框架层.jpg](http://upload-images.jianshu.io/upload_images/264714-b815f1f4785fbcc3.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

最后，在pages类的构造函数中，通过依赖注入的方式引入一个BaMenuService的service，并调用该服务的updateMenuByRoutes方法来根据当前路由来调整菜单的选中。其中参数PAGES_MENU对应pages.menu.ts定义的菜单内容。

### 2.4.2. 框架页面菜单项定义

src/app/pages/pages.menu.ts定义了我们的菜单项：

``` js
export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'dashboard',
        data: {
          menu: {
            title: 'general.menu.dashboard',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'editors',
        data: {
          menu: {
            title: 'general.menu.editors',
            icon: 'ion-edit',
            selected: false,
            expanded: false,
            order: 100,
          }
        },
        children: [
          {
            path: 'ckeditor',
            data: {
              menu: {
                title: 'general.menu.ck_editor',
              }
            }
          }
        ]
      },
      ...
    ]
  }
];

```
其中path定义了菜单项对应的路由路径，title定义了菜单项名称。该名称是通过国际化文件src/assets/i18n/US/en.json进行定义的。我们往后的章节说到国际化的时候会阐述，这里我们之需要知道我们可以通过修改这个文件来对菜单项进行一些定制化操作就足够了。

### 2.4.2. 框架视图层模块
src/app/pages/pages.module.ts 是框架视图的模块定义文件。主要功能是将页面框架视图，需要用到的服务和第三方模块等进行模块化。

比如上面提及的NgaModule模块:

``` js
import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { routing }       from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';

import { Pages } from './pages.component';

@NgModule({
  imports: [CommonModule, AppTranslationModule, NgaModule, routing],
  declarations: [Pages]
})
export class PagesModule {
}
```

### 2.4.3. 框架视图路由

src/app/pages/pages.routing.ts定义了框架视图层的路由。

``` js
import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule' },
      { path: 'editors', loadChildren: 'app/pages/editors/editors.module#EditorsModule' },
      { path: 'components', loadChildren: 'app/pages/components/components.module#ComponentsModule' },
      { path: 'charts', loadChildren: 'app/pages/charts/charts.module#ChartsModule' },
      { path: 'ui', loadChildren: 'app/pages/ui/ui.module#UiModule' },
      { path: 'forms', loadChildren: 'app/pages/forms/forms.module#FormsModule' },
      { path: 'tables', loadChildren: 'app/pages/tables/tables.module#TablesModule' },
      { path: 'maps', loadChildren: 'app/pages/maps/maps.module#MapsModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

```
其中 login, register和pages这三个二级路由对应的视图都会在上面提及的根组件的router-outlet下面进行展开；而pages路由下面的所有三级路由所对应视图，都会在上一小节描述的框架视图中的router-outlet下，也就是在内容标题下面进行展开。

## 2.5. 第三层 - 页面内容层

这一层由src/app/pages下面的各个文件夹组成，主要是对pages框架内的一个页面的实现，比如dashboard页面。也有例外，比如login和register页面是不在pages框架内的，因为还没有登录，所以不需要有pages框架的菜单栏等。

毫无例外，这一层也是模块化的，和上面两层一样，同样是由component,routing,module这些ts文件组成。在当前阶段，我们只需要知道它拥有同样的组织方式就好了。

因为我们今后要实现我们自己的页面内容，所以这一层是我们今后工作的重点。我们在往后的章节中会做更详尽的实现和描述。

# 3. 结语
---

详细实现请查看github中的代码。
-  git clone https://github.com/zhubaitian/XiaoHuangShuPlatform.git
- cd XiaoHuangShuPlatform/

运行:
> - npm install
- npm start

---
>本文由天地会珠海分舵编写，转载需授权，喜欢点个赞，吐槽请评论，进一步交流请关注公众号**techgogogo**或者直接联系本人微信**zhubaitian1**


# 第二章 Angularjs 2.0应用的国际化

通过上一章，我们学习了Angularjs 2.0的基础知识以及对ng2-admin后台管理模板有了初步的了解。

这一章我们的计划是让ng2-admin支持上中文语言，并学习ng2的国际化相关知识。

[ngx-translate](https://github.com/ngx-translate/core)是ng2的国际化模块， 我们可以通过其在github上的README来学习该模块的使用。

同时，也可以在线上编辑并体验相关的用法：
[https://plnkr.co/edit/01UjWY3TKfP6pgwXKuEa?p=preview](https://plnkr.co/edit/01UjWY3TKfP6pgwXKuEa?p=preview)

# 1. ng2国际化模块ngx-translate使用
---
## 1.1. 安装

``` shell
npm install @ngx-translate/core --save
```

## 1.2. 使用

### 1.2.1. 导入TranslateModule模块

要使用ngx-translate，我们需要引入TranslateModule模块，并在应用的根模块的NgModule修饰器配置选项的imports中导入TranslateModule.forRoot()。以下就是示例代码：

``` js
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        BrowserModule,
        TranslateModule.forRoot()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

静态方法forRoot是一个约定，它可以让开发人员更轻松的配置模块的provider。通常的做法是在forRoot的参数中传入一个模块的配置对象，然后获得一个配置好的带有Provider配置的Module。比如我们往下可以看到我们可以在TranslateModule.forRoot()中传入一个loader设置来配置该如何加载国际化文件。

>上一章碰到的RouterModule.forRoot就是一个很好的例子。 应用把一个Routes对象传给RouterModule.forRoot，为的就是使用路由配置全应用级的Router服务。 RouterModule.forRoot返回一个[ModuleWithProviders](https://angular.cn/docs/ts/latest/api/core/index/ModuleWithProviders-interface.html)对象。 我们把这个结果添加到根模块AppModule的imports列表中。

>只能在应用的根模块AppModule中调用并导入.forRoot
的结果。 在其它模块中导入它，特别是惰性加载模块中，是违反设计目标的并会导致一个运行时错误。

>RouterModule也提供了静态方法forChild，用于配置惰性加载模块的路由。

>***forRoot***和***forChild***都是方法的约定名称，它们分别用于在根模块和特性模块中配置服务。

>Angular并不识别这些名字，但是Angular的开发人员可以。 当你写类似的需要可配置的服务提供商时，请遵循这个约定。

### 1.2.2. 配置国际化模块

默认情况下，TranslateModule并没有提供任何加载国际化文件的方式。我们可以自己编写加载器，也可以使用第三方的加载器来达成我们的目标。

比如，我们可以用[TranslateHttpLoader
](https://github.com/ngx-translate/http-loader)来以http的方式从本地加载我们的国际化文件(假设我们的国际化文件是放在项目根目录的assets/i18n/这个目录下面，一般英文的国际化文件名称会是en.json，中文的是zh.json)。

``` js
export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

创建TranslateHttpLoader时我们指定了3个参数：

- **http**：代表我们通过http的方式来加载国际化文件。所以在import TranslateHtppLoader之前，我们需要确保先从@angular/http中把Http给import进来
- **./assets/i18n/**: 目标国际化文件所存放的目录
- **.json**： 目标国际化文件的后缀。往下可以看到，通过配合TranslateService服务实例的translate.use('en')，我们可以指定加载的是en.json这个文件。

创建好加载器后，我们就可以在TranslateModule.forRoot方法中，通过在参数中配置相应的加载器选项来生成一个配置好的国际化模块。

# 1.2.3. 通过TranslateService加载国际化文件

配置好国际化模块之后，应用就知道去哪里加载我们的国际化文件了。此时我们就可以通过TranslateService这个服务来操作国际化文件的加载了：

``` js
import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app',
    template: `
        <div>{{ 'HELLO' | translate:param }}</div>
    `
})
export class AppComponent {
    param = {value: 'world'};

    constructor(translate: TranslateService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');

         // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');
    }
}
```

比如，我们可以通过translate.use('zh')来尝试加载zh.json国际化文件。通过translate.setDefaultLang('en')来设置默认加载的是en.json国际化文件，以便在没有找到zh.json国际化文件时，可以fallback到en.json文件。

## 1.3. 国际化文件编写

我们一般会通过json格式的文件来保存我们需要国际化的子串，比如en.json中：

``` json
{
    "HOME": {
        "HELLO": "hello {{value}}"
    }
}
```
在需要进行国际化的页面模板代码中，我们可以通过HOME.HELLO的方式直接获取到翻译后的子串。

同时，国际化子串还支持参数化。

比如，这里我们通过{{value}}来指定value这个值是需要在模板代码中传进来的。

## 1.4. 页面模板通过TranslateService进行字串国际化

根据README，我们可以通过服务调用，管道，directive指定这几种方式对字串进行国际化。无论是哪种方式，在对应的component文件中，我们都需要在构造函数中注入TranslateService这个服务的依赖。

- 通过服务调用的方式进行国际化的示例代码如下:

``` js
translate.get('HELLO', {value: 'world'}).subscribe((res: string) => {
    console.log(res);
    //=> 'hello world'
});
```

 需要注意的是，前面提到的需要参数化的value是作为translate.get的第二个参数传进去的。

- 通过管道的方式进行国际化的示例代码：

``` js
<div>{{ 'HELLO' | translate:param }}</div>
```

这时需要在对应的component文件中定义好参数化的数据结构param：

``` js
param = {value: 'world'};
```

- 通过directive指令的方式进行国际化的示例代码：

``` js
<div [translate]="'HELLO'" [translateParams]="{value: 'world'}"></div>
```

或者

``` js
<div translate [translateParams]="{value: 'world'}">HELLO</div>
```

# 2. ng2-admin国际化
---
ng2-admin管理平台模板默认只提供了英文语言的支持，比如登录界面：

![Login_en.jpeg](http://upload-images.jianshu.io/upload_images/264714-1e524f58d3316845.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

但是，模板代码中已经通过ngx-translate实现了对国际化的支持。

## 2.1. 国际化支持模块

src/app/app.tranlation.module.ts文件就是ng2-admin的国际化支持模块:

``` js
import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateService } from '@ngx-translate/core';

export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const translationOptions = {
  loader: {
    provide: TranslateLoader,
    useFactory: (createTranslateLoader),
    deps: [Http]
  }
};

@NgModule({
  imports: [TranslateModule.forRoot(translationOptions)],
  exports: [TranslateModule],
  providers: [TranslateService]
})
export class AppTranslationModule {
  constructor(private translate: TranslateService) {
    translate.addLangs(["en"]);
    translate.setDefaultLang('en');
    translate.use('en');
  }
}

```

代码和第一节的示例基本上是一样的，所以这里就没有必要过多解析了，该模块的最终目的就是通过加载./assets/i18n/en.json文件，实现一个AppTranslationModule。 其他模块通过引入这个模块，就能将对应的需要国际化的字串翻译成en.json中对应的英文字串。

en.json的英文翻译文件内容如下所示：

``` json
{
  "login": {
    "title": "Sign in to ng2-admin",
    "signup_link": "New to ng2-admin? Sign up!",
    "email": "Email",
    "password": "Password",
    "sign_in": "Sign in",
    "forgot_password": "Forgot password?",
    "sign_from_app_text": "or Sign in with one click",
    "share_on_facebook": "Share on Facebook",
    "share_on_twitter": "Share on Twitter",
    "share_on_google_plus": "Share on Google Plus"
  },
  "general": {
    "akveo": "Akveo",
    "home": "Home",
    "forms": {
      "option1": "Option 1"
    },
    "menu": {
      "dashboard": "Dashboard",
      "editors": "Editors",
      "ck_editor": "CKEditor",
      "components": "Components",
      "tree_view": "Tree View",
      "charts": "Charts",
      "chartist_js": "Chartist.Js",
      "ui_features": "UI Features",
      "typography": "Typography",
      "buttons": "Buttons",
      "icons": "Icons",
      "modals": "Modals",
      "grid": "Grid",
      "form_elements": "Form Elements",
      "form_inputs": "Form Inputs",
      "form_layouts": "Form Layouts",
      "tables": "Tables",
      "basic_tables": "Basic Tables",
      "smart_tables": "Smart Tables",
      "maps": "Maps",
      "google_maps": "Google Maps",
      "leaflet_maps": "Leaflet Maps",
      "bubble_maps": "Bubble Maps",
      "line_maps": "Line Maps",
      "pages": "Pages",
      "login": "Login",
      "register": "Register",
      "menu_level_1": "Menu Level 1",
      "menu_level_1_1": "Menu Level 1.1",
      "menu_level_1_2": "Menu Level 1.2",
      "menu_level_1_2_1": "Menu Level 1.2.1",
      "external_link": "External Link"
    },
    "created_with": "Created with"
  },
  "dashboard": {
    "acquisition_channels": "Acquisition Channels",
    "users_by_country": "Users by Country",
    "revenue": "Revenue",
    "feed": "Feed",
    "todo_list": "To Do List",
    "calendar": "Calendar",
    "new_visits": "New Visits",
    "purchases": "Purchases",
    "active_users": "Active Users",
    "returned": "Returned",
    "popular_app": {
      "super_app": "Super App",
      "most_popular_app": "Most Popular App",
      "total_visits": "Total Visits",
      "new_visits": "New Visits",
      "sales": "Sales"
    },
    "todo": {
      "task_todo": "Task to do.."
    },
    "traffic_chart": {
      "view_total": "Views Total"
    }
  },
  "tree_view": {
    "title": "basic",
    "programming": "Programming languages by programming paradigm",
    "oop": "Object-oriented programming",
    "java": "Java",
    "c_plus_plus": "C++",
    "c_sharp": "C#",
    "prototype": "Prototype-based programming",
    "java_script": "JavaScript",
    "coffee_script": "CoffeeScript",
    "lua": "Lua"
  },
  "chart": {
    "lines": "Lines",
    "bars": "Bars",
    "simple_line_chart": "Simple line chart",
    "line_chart": "Line chart with area",
    "bi_polar_line_chart": "Bi-polar line chart with area only",
    "simple_bar_chart": "Simple bar chart",
    "multi_line_labels_bar_chart": "Multi-line labels bar chart",
    "stacked_bar_chart": "Stacked bar chart",
    "pies_and_donuts": "Pies & Donuts",
    "simple_pie": "Simple Pie",
    "pie_with_labels": "Pie with labels",
    "donut": "Donut"
  }
}

```

### 2.2. 中文翻译文件zh.json

既然我们需要支持中文的国际化，那么我们首先要做的工作就是提供一个和en.json对应的zh.json中文翻译文件。

注意，这里取名为zh.json是有道理的。因为我们下面通过api在判断浏览器当前语言的时候，如果是中文，返回来的会是zh。

下面就是本人粗糙翻译后的版本，有些不好翻译的就没有翻译了，只是作为个示例而已。

``` json
{
  "login": {
    "title": "登录 ng2-admin",
    "signup_link": "ng2-admin新手? 注册!",
    "email": "邮箱",
    "password": "密码",
    "sign_in": "登录",
    "forgot_password": "忘记密码?",
    "sign_from_app_text": "一键登录",
    "share_on_facebook": "分享到 Facebook",
    "share_on_twitter": "分享到 Twitter",
    "share_on_google_plus": "分享到 Google Plus"
  },
  "general": {
    "akveo": "Akveo",
    "home": "主页",
    "forms": {
      "option1": "选择 1"
    },
    "menu": {
      "dashboard": "仪表盘",
      "editors": "编辑器",
      "ck_editor": "CKEditor",
      "components": "组件",
      "tree_view": "树形视图",
      "charts": "图表",
      "chartist_js": "Chartist.Js",
      "ui_features": "UI 功能",
      "typography": "排版",
      "buttons": "按钮",
      "icons": "图标",
      "modals": "模型对话框",
      "grid": "网格",
      "form_elements": "表单元素",
      "form_inputs": "表单输入",
      "form_layouts": "表单布局",
      "tables": "表格",
      "basic_tables": "基础表格",
      "smart_tables": "只能表格",
      "maps": "地图",
      "google_maps": "谷歌地图",
      "leaflet_maps": "Leaflet Maps",
      "bubble_maps": "Bubble Maps",
      "line_maps": "Line Maps",
      "pages": "页面",
      "login": "登录",
      "register": "注册",
      "menu_level_1": "一级菜单1",
      "menu_level_1_1": "二级菜单1.1",
      "menu_level_1_2": "二级菜单1.2",
      "menu_level_1_2_1": "三级菜单1.2.1",
      "external_link": "外链"
    },
    "created_with": "Created with"
  },
  "dashboard": {
    "acquisition_channels": "获客渠道",
    "users_by_country": "不同国家使用情况",
    "revenue": "营收",
    "feed": "反馈",
    "todo_list": "待办事项",
    "calendar": "日历",
    "new_visits": "最近访客",
    "purchases": "购买",
    "active_users": "活动用户",
    "returned": "返修",
    "popular_app": {
      "super_app": "超级应用",
      "most_popular_app": "最受欢迎应用",
      "total_visits": "总访客",
      "new_visits": "新访客",
      "sales": "销售"
    },
    "todo": {
      "task_todo": "待处理任务.."
    },
    "traffic_chart": {
      "view_total": "全部访客"
    }
  },
  "tree_view": {
    "title": "基础",
    "programming": "不同编程范式下的不同编程语言",
    "oop": "面向对象类",
    "java": "Java",
    "c_plus_plus": "C++",
    "c_sharp": "C#",
    "prototype": "Prototype-based programming",
    "java_script": "JavaScript",
    "coffee_script": "CoffeeScript",
    "lua": "Lua"
  },
  "chart": {
    "lines": "线图",
    "bars": "柱形图",
    "simple_line_chart": "简单线图",
    "line_chart": "Line chart with area",
    "bi_polar_line_chart": "Bi-polar line chart with area only",
    "simple_bar_chart": "Simple bar chart",
    "multi_line_labels_bar_chart": "Multi-line labels bar chart",
    "stacked_bar_chart": "Stacked bar chart",
    "pies_and_donuts": "饼状图 & 圆环图",
    "simple_pie": "饼状图",
    "pie_with_labels": "带标签的饼状图",
    "donut": "圆环图"
  }
}

```

下一步我们就需要修改上面的app.tranlation.module.ts的代码：

- 让其默认加载上英文和中文两个翻译文件
- 默认在找不到目标翻译文件时，使用英文翻译文件
- 指定希望使用的是中文翻译文件

``` js
export class AppTranslationModule {
  constructor(private translate: TranslateService) {
    translate.addLangs(["en", "zh"]);
    translate.setDefaultLang('en');
    translate.use('zh');
  }
}
```

最终，以登录页面为例子，国际化后的呈现时这样的：
![Login_cn.jpeg](http://upload-images.jianshu.io/upload_images/264714-8f28abacfe78d07e.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

大家可以参考zh.json的翻译文件进行对照查看。

## 2.3. 自动根据浏览器当前语言进行国际化

上面我们是通过指定中文翻译文件来实现中文的国际化的。但是，很多时候我们更希望做到的是，根据浏览器当前的语言进行国际化。

这个时候我们可以修改代码如下:

``` js
export class AppTranslationModule {
  constructor(private translate: TranslateService) {
    translate.addLangs(["en", "zh"]);
    translate.setDefaultLang('en');
    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|zh/) ? browserLang : 'en');
  }
}
```
首先获取浏览器的当前语言，然后设置究竟使用哪个翻译文件进行国际化。

大家可以设置下浏览器的语言分别为中文和英文来体验下修改是否起效。

## 2.4. 页面模板文件翻译方式

最终，我们以登录页面为示例，看下login.html文件里面是如何通过translate服务的指令和管道方式来实现国际化的：

```
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
大家可以参照上面的1.4. 页面模板通过TranslateService进行字串国际化来对比查看，我们这里主要用了其中的两种翻译方式：

- **directive指令方式**: 比如标题的翻译
``` html
<h1 translate>{{'login.title'}}</h1>
```
- **管道方式**:  比如密码输入框的占位符的翻译:
``` html
placeholder="{{'login.password' | translate}}"
```

# 3. 结语
---

详细实现请查看github中的代码。
-  git clone https://github.com/zhubaitian/XiaoHuangShuPlatform.git
- cd XiaoHuangShuPlatform/
- git checkout CH01

运行:
> - npm install
- npm start

---
>本文由天地会珠海分舵编写，转载需授权，喜欢点个赞，吐槽请评论，进一步交流请关注公众号**techgogogo**或者直接联系本人微信**zhubaitian1**

