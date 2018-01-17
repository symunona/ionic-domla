import { DayProvider } from './../../providers/day/day';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EditDayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-day',
  templateUrl: 'edit-day.html',
})
export class EditDayPage {

  day: any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public dayProvider: DayProvider
  ) {
  }

  ionViewDidLoad() {
    this.dayProvider.getDay(this.navParams.get('dayId'))
      .on('value', eventSnapshot => {        
        this.day = eventSnapshot.val() || {};
        this.day.id = eventSnapshot.key;
      });
  }

  saveTheDay(){
    let update = {}
    if (this.day.title){
      update['title'] = this.day.title
    }
    if (this.day.description){
      update['description'] = this.day.description
    }
    if (this.day.tags){
      update['tags'] = this.day.tags
    }
    this.dayProvider.updateDay(this.day.id, update)
  }
}
