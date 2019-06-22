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
