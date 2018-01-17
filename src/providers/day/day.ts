import { Injectable } from '@angular/core';
import { Reference } from '@firebase/database-types';
import firebase from 'firebase';
import moment from 'moment';

/*
  Generated class for the DayProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DayProvider {

  public user: any
  public dayListRef: Reference;
  public idFormat: string = 'YYYY-MM-DD';
  public firstDay: Object;

  constructor() {
    console.log('Hello DayProvider Provider');

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        this.dayListRef = firebase.database().ref(`/userProfile/${user.uid}/days`);
      }
    });
  }

  updateDay(dayId: string, dayData: Object) {
    firebase.database().ref(`/userProfile/${this.user.uid}/days/${dayId}`)
      .set(dayData);
  }

  public getDayMap(): Reference {
    let range = 14;
    let today = moment().startOf('day')    

    return firebase.database().ref(`/userProfile/${this.user.uid}/days`);
  }

  getDay(dayId: string): Reference {
    var ref = this.dayListRef.child(dayId);
    return ref;
  }


}
