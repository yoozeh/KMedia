import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetworkService } from '../../services/network.service';
import { UserService } from '../../services/user.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    NetworkService,
    UserService
  ]
})
export class AppServicesModule { }
