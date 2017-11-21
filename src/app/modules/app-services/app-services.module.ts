import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetworkService } from '../../services/network.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    NetworkService
  ]
})
export class AppServicesModule { }
