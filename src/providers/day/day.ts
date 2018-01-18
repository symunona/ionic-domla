import { Injectable } from '@angular/core';
import { Reference } from '@firebase/database-types';
import firebase from 'firebase';

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
        // DEBUG: Expose the days interface so it can be updated manually.
        window['days'] = this.dayListRef;
      }
    });
  }

  updateDay(dayId: string, dayData: Object) {
    firebase.database().ref(`/userProfile/${this.user.uid}/days/${dayId}`)
      .set(dayData);
  }

  public getDayMap(): Reference {        
    return firebase.database().ref(`/userProfile/${this.user.uid}/days`);
  }

  getDay(dayId: string): Reference {
    var ref = this.dayListRef.child(dayId);
    return ref;
  }


}
