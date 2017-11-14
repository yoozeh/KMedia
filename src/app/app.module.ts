import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppServicesModule } from './modules/app-services/app-services.module';
import { AppRoutingModule } from './modules/app-routing/app-routing.module';
import { AngularMaterialModule } from './modules/angular-material/angular-material.module';

import { AppComponent } from './app.component';

import { DialogComponent } from './components/dialog/dialog.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    SidenavComponent,
    ToolbarComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppServicesModule,
    AppRoutingModule,
    AngularMaterialModule
  ],
  providers: [],
  entryComponents: [
    DialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
