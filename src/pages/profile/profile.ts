import { Component } from "@angular/core";
import {
  Alert,
  AlertController,
  IonicPage,
  NavController
} from "ionic-angular";
import { ProfileProvider } from "../../providers/profile/profile";
import { AuthProvider } from "../../providers/auth/auth";
@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  public userProfile: any;
  public birthDate: string;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public profileProvider: ProfileProvider
  ) { }

  ionViewDidLoad() {
    console.warn('view did load')
    this.profileProvider.getAuth().onAuthStateChanged(user => {
      console.warn('registering auth')
      this.profileProvider.getUserProfile().on("value", userProfileSnapshot => {
        console.warn('user just got a profile')
        this.userProfile = userProfileSnapshot.val();        
      });
    })
    // try {
    //   var promise = this.profileProvider.getUserProfile()
    //   if (promise) {
    //     promise.on("value", userProfileSnapshot => {
    //       this.userProfile = userProfileSnapshot.val();
    //       this.birthDate = userProfileSnapshot.val().birthDate;
    //     });
    //   }
    //   else{
    //       console.warn('this aint workin')
    //   }
    // } catch (e) {
    //   console.error(e)
    // }
  }

  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot("LoginPage");
    });
  }

  updateName(): void {
    const alert: Alert = this.alertCtrl.create({
      message: "Name you want to be displayed",
      inputs: [
        {
          name: "name",
          placeholder: "Display Name",
          value: this.userProfile?this.userProfile.name:''
        }
      ],
      buttons: [
        { text: "Cancel" },
        {
          text: "Save",
          handler: data => {
            this.profileProvider.updateName(data.name);
          }
        }
      ]
    });
    alert.present();
  }

  updateEmail(): void {
    let alert: Alert = this.alertCtrl.create({
      inputs: [{ name: 'newEmail', placeholder: 'Your new email' },
      { name: 'password', placeholder: 'Your password', type: 'password' }],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider
              .updateEmail(data.newEmail, data.password)
              .then(() => { console.log('Email Changed Successfully'); })
              .catch(error => { console.log('ERROR: ' + error.message); });
          }
        }]
    });
    alert.present();
  }

  updatePassword(): void {
    let alert: Alert = this.alertCtrl.create({
      inputs: [
        { name: 'newPassword', placeholder: 'New password', type: 'password' },
        { name: 'oldPassword', placeholder: 'Old password', type: 'password' }],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updatePassword(
              data.newPassword,
              data.oldPassword
            );
          }
        }
      ]
    });
    alert.present();
  }
}