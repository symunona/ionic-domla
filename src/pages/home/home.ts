import { Reference } from '@firebase/database-types';
import { DayProvider } from './../../providers/day/day';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Content } from 'ionic-angular';
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

  idFormat:string = 'YYYY-MM-DD'

  days: Array<Object> = []
  dayMapObservable: Reference
  dayMap: Object
  pageSize: number = 100
  

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
  editDay(dayId: string): void {    
    this.navCtrl.push("EditDayPage", { dayId: dayId });
  }
  ionViewWillEnter(): void {    
    if (!this.lastScrollPosition){
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

  populateNextPage(reset: boolean){
    let limit = this.pageSize;
    if (reset){
      limit = this.days.length || this.pageSize
      this.days.splice(0, this.days.length)     
      this.firstDay = moment().startOf('day')
    } 
    for (let i = 0; i < limit + 1; i++) {      
      let dayKey: string = this.firstDay.format(this.idFormat)
      let newDay = {
        id: dayKey,
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
