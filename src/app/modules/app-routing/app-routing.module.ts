import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FoundationComponent } from '../../components/foundation/foundation.component';
import { HomeComponent } from '../../components/home/home.component';
import { PageNotFoundComponent } from '../../components/page-not-found/page-not-found.component';
import { RedirectComponent } from '../../components/redirect/redirect.component';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';

const routes: Routes = [
  { path: 'redirect', component: RedirectComponent },
  { path: 'redirect/:component', component: RedirectComponent },
  {
    path: '', component: FoundationComponent, children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'error', component: PageNotFoundComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
