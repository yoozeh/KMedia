import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppConfigureModule } from './modules/app-configure/app-configure.module';
import { AppRoutingModule } from './modules/app-routing/app-routing.module';
import { AngularMaterialModule } from './modules/angular-material/angular-material.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppConfigureModule,
    AppRoutingModule,
    AngularMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
