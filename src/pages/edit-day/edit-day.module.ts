import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditDayPage } from './edit-day';

@NgModule({
  declarations: [
    EditDayPage,
  ],
  imports: [
    IonicPageModule.forChild(EditDayPage),
  ],
})
export class EditDayPageModule {}
