import { User } from './../models/user';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from '@firebase/app';
import '@firebase/auth';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth
    ) {
      this.user$ = this.afAuth.authState;
  }

  async signInWithEmailAndPassword(user) {
    return this.afAuth.signInWithEmailAndPassword(user.inputEmail, user.inputPassword);
  }

  signUpWithEmailAndPassword(user) {
    return this.afAuth.createUserWithEmailAndPassword(user.inputEmail, user.inputPassword)
      .then(userCredential => {
        userCredential.user.updateProfile({
          displayName: user.inputFirstName + ' ' + user.inputLastname
        });
      })
  }

  async signWithGoogle() {
    return this.afAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  async signOut() {
    return this.afAuth.signOut();
  }

}
