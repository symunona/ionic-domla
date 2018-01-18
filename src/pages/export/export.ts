import { DayProvider } from './../../providers/day/day';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Reference } from '@firebase/database-types';
import firebase from 'firebase';

/**
 * Generated class for the ExportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-export',
  templateUrl: 'export.html',
})
export class ExportPage {

  public user: any
  days: Array<Object> = []
  dayMapObservable: Reference
  dayMap: Object
  firstDay: string
  exported: string

  constructor(public navCtrl: NavController, public navParams: NavParams, public dayProvider: DayProvider) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        this.dayMapObservable = dayProvider.getDayMap();
        this.dayMapObservable.on('value', allDays => {
          this.dayMap = allDays.exportVal();          
          this.firstDay = Object.keys(this.dayMap).sort()[0]
          console.log(this.firstDay);
          this.exported = this.user.name + ' ' +this.user.email + '\n'
          let counter = 0
          for(let key in this.dayMap){
            this.exported += counter + ' ' + key + ' ' +  this.dayMap[key].title + ' ' + this.dayMap[key].tags + '\n'
            this.exported += this.dayMap[key].description.split('\n').map(l => '\t'+l).join('\n') + '\n\n';
            counter++
          }          
        })        
      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExportPage');
  }

}
