import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { Login } from './login.component';
import { routing }       from './login.routing';
import { LoginService } from './login.service';
import {ToasterModule} from 'angular2-toaster';
import {ToasterContainerComponent} from 'angular2-toaster';

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
    Login,
    // ToasterContainerComponent,
  ],
  providers: [
    LoginService,
  ]
})
export class LoginModule {}
