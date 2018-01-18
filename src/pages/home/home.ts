import { Reference } from '@firebase/database-types';
import { DayProvider } from './../../providers/day/day';
import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import firebase from 'firebase';
import moment, { Moment } from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public user: any
  dayList: Array<any>
  firstDay: Moment
  populatedOnce: Boolean = false
  lastScrollPosition: any

  idFormat: string = 'YYYY-MM-DD'

  days: Array<Object> = []
  dayMapObservable: Reference
  dayMap: Object
  pageSize: number = 40


  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, public dayProvider: DayProvider) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        this.dayMapObservable = dayProvider.getDayMap();
        this.dayMapObservable.on('value', allDays => {
          this.dayMap = allDays.exportVal();
          this.populateNextPage(true);
          this.scrollToBottom();
        })
        this.firstDay = moment().startOf('day')
      }
    });

  }
  goToProfile(): void {
    this.navCtrl.push("ProfilePage");
  }
  goToStats(): void {
    this.navCtrl.push("StatsPage");
  }
  goToExport(): void {
    this.navCtrl.push("ExportPage");
  }
  editDay(dayId: string): void {
    this.navCtrl.push("EditDayPage", { dayId: dayId });
  }
  ionViewWillEnter(): void {
    if (!this.lastScrollPosition) {
      this.scrollToBottom();
    }
    else {
      // restore scroll
      setTimeout(() => {
        this.content.scrollTo(0, this.lastScrollPosition);
      }, 100)

    }
  }

  ionViewWillLeave() {
    this.lastScrollPosition = this.content.scrollTop;
  }

  populateNextPage(reset: boolean) {
    let limit = this.pageSize;
    let firstLoggedDay

    if (Object.keys(this.dayMap).length) {
      firstLoggedDay = Object.keys(this.dayMap)[0]
    }
    else {
      firstLoggedDay = moment().format(this.idFormat)
    }
    let firstLoggedDayMoment = moment(firstLoggedDay, this.idFormat)

    if (reset) {
      limit = this.days.length || this.pageSize
      this.days.splice(0, this.days.length)
      this.firstDay = moment().startOf('day')
    }
    for (let i = 0; i < limit + 1; i++) {
      let dayKey: string = this.firstDay.format(this.idFormat)
      let dayCount = moment(dayKey, this.idFormat).diff(firstLoggedDayMoment, 'days')
      let newDay = {
        id: dayKey,
        count: dayCount,
        data: this.dayMap[dayKey] || {}
      }

      this.days.unshift(newDay);

      this.firstDay.subtract(1, 'day')
    }
  }

  doInfinite(infiniteScroll) {
    if (this.dayMap) {
      this.populateNextPage(false);
      infiniteScroll.complete();
    }
    else {
      infiniteScroll.complete();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(0);
    });
  }

}
