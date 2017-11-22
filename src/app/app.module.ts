import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { APP_CONFIG, APP_TEXT, AppEnvironmentsService } from './app.environments.service';

import { AppServicesModule } from './modules/app-services/app-services.module';
import { AppRoutingModule } from './modules/app-routing/app-routing.module';
import { AngularMaterialModule } from './modules/angular-material/angular-material.module';

import { KMatDateInputComponent } from './components/k-mat-date-input/k-mat-date-input.component';
import { KMatNoticeTextComponent } from './components/k-mat-notice-text/k-mat-notice-text.component';
import { KMatRadioGroupComponent } from './components/k-mat-radio-group/k-mat-radio-group.component';

import { DialogComponent } from './components/dialog/dialog.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { TermsComponent } from './components/terms/terms.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    KMatDateInputComponent,
    KMatNoticeTextComponent,
    KMatRadioGroupComponent,
    DialogComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    SidenavComponent,
    SignUpComponent,
    TermsComponent,
    ToolbarComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppServicesModule,
    AppRoutingModule,
    AngularMaterialModule
  ],
  providers: [
    AppEnvironmentsService,
    { provide: APP_CONFIG, useValue: AppEnvironmentsService.configure },
    { provide: APP_TEXT, useValue: AppEnvironmentsService.text }
  ],
  entryComponents: [
    DialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
