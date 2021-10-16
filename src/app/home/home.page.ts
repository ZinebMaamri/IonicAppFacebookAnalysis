import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import * as firebase from 'firebase/compat/app';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export const Providers={
  facebook: new firebase.default.auth.FacebookAuthProvider()
}
export class HomePage implements OnInit {
  public loading;
  providerFb: firebase.default.auth.FacebookAuthProvider
  fireAuth: any;
  constructor(
    private router: Router,
    private fb: Facebook,
    public loadingController: LoadingController,
    public afDB: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public platform: Platform
    ) {
      this.providerFb= new firebase.default.auth.FacebookAuthProvider();
    }


  async ngOnInit() {
    this.loading = await this.loadingController.create({
      message: 'Connecting ...'
    });
  }
  async login() {

    this.fb.login(['email'])
      .then((response: FacebookLoginResponse) => {
        this.onLoginSuccess(response);
        console.log(response.authResponse.accessToken);
      }).catch((error) => {
        console.log(error);
        alert('error:' + error);
      });
  }

  onLoginSuccess(res: FacebookLoginResponse) {
    // const { token, secret } = res;
    const credential = firebase.default.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    this.fireAuth.signInWithCredential(credential)
      .then((response) => {
        this.router.navigate(['/profile']);
        this.loading.dismiss();
      });

  }
  facebookLogin() {
      if (this.platform.is('cordova')) {
        console.log('PLateforme cordova');
        this.facebookCordova();
      } else {
        console.log('PLateforme Web');
        this.facebookWeb();
      }
  }
  facebookCordova() {
    this.fb.login(['email']).then( (response) => {
        const facebookCredential = firebase.default.auth.FacebookAuthProvider
            .credential(response.authResponse.accessToken);
        firebase.default.auth().signInWithCredential(facebookCredential)
        .then((success) => {
            console.log('Info Facebook: ' + JSON.stringify(success));
        }).catch((error) => {
            console.log('Erreur: ' + JSON.stringify(error));
        });
    }).catch((error) => { console.log(error); });
  }
  facebookWeb() {
    this.afAuth
      .signInWithPopup(new firebase.default.auth.FacebookAuthProvider())
      .then((success) => {
        console.log('Info Facebook: ' + JSON.stringify(success));
      }).catch((error) => {
        console.log('Erreur: ' + JSON.stringify(error));
      });
  }
}

