import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DayListPage } from './day-list';

@NgModule({
  declarations: [
    DayListPage,
  ],
  imports: [
    IonicPageModule.forChild(DayListPage),
  ],
})
export class DayListPageModule {}
