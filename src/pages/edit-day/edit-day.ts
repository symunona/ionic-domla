import { DayProvider } from './../../providers/day/day';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment, { Moment } from 'moment';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Navbar } from 'ionic-angular/components/toolbar/navbar';
import { HomePage } from '../home/home';

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

  idFormat: string;
  prevDay: any;
  day: any;


  @ViewChild(Navbar) navBar: Navbar
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dayProvider: DayProvider,
    public viewCtrl: ViewController
  ) { }


  nextDay() {
    this.navCtrl.push("EditDayPage", {
      dayId: moment(this.day.id, this.dayProvider.idFormat)
        .startOf('day')
        .add(1, 'day').format(this.dayProvider.idFormat)
    });
  }

  prevDayLink() {
    this.navCtrl.push("EditDayPage", {
      dayId: moment(this.day.id, this.dayProvider.idFormat)
        .startOf('day')
        .add(-1, 'day').format(this.dayProvider.idFormat)
    });
  }

  ionViewDidLoad() {
    let id = this.navParams.get('dayId')
    if (!id) {
      if (localStorage.getItem('lastDayLoaded')) {
        id = localStorage.getItem('lastDayLoaded')
      }
      else {
        this.navCtrl.setRoot('HomePage')
      }
    }
    let isThisAPromise = this.dayProvider.getDay(this.navParams.get('dayId'));
    if (!isThisAPromise.then) {
      this.registerListener.call(this, isThisAPromise)
    }
    else {
      isThisAPromise.then(this.registerListener.bind(this))
    }

    this.navBar.backButtonClick = (e: UIEvent) => {
      // todo something
      this.navCtrl.setRoot(HomePage)
    }
  }

  registerListener(reference: any) {
    reference.on('value', eventSnapshot => {
      this.day = eventSnapshot.val() || {};
      this.day.id = eventSnapshot.key;
      localStorage.setItem('lastDayLoaded', this.day.id);

      let prevDayId = moment(this.day.id, this.dayProvider.idFormat)
        .startOf('day')
        .subtract(1, 'day').add(1,'second').format(this.dayProvider.idFormat)
        // console.warn(this.day.id, moment(this.day.id, this.dayProvider.idFormat).format())
      this.dayProvider.getDay(prevDayId).on('value', prevDaySnapshot => {
        this.prevDay = prevDaySnapshot.val();
      });
    });
  }

  saveTheDay() {
    let update = {}
    if (this.day.title) {
      update['title'] = this.day.title
    }
    if (this.day.description) {
      update['description'] = this.day.description
    }
    if (this.day.tags) {
      update['tags'] = this.day.tags
    }
    this.dayProvider.updateDay(this.day.id, update)
  }
}
