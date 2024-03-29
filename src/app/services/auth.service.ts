import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { User } from '../shared/models/user';

/**
 * Authentication Service for gaining access
 *
 * @author Brett Batey
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = new User(
          result.user?.uid,
          result.user?.email,
          result.user?.displayName,
          result.user?.emailVerified
        );
        if (token) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        // redirect to the search page
        this.router.navigate(['list']);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.log(
          `error code: ${errorCode} error message: ${errorMessage} email: ${email} auth credential type: ${credential}`
        );
      });
  }

  isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user !== null && user.emailVerified;
  }

  logout() {
    getAuth()
      .signOut()
      .then(() => {
        localStorage.removeItem('user');
      });
  }
}
