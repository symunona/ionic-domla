import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public user:any;
  
  constructor(public navCtrl: NavController) {
    this.user = firebase.auth().currentUser
  }

}
