import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor( private auth: AngularFireAuth ){}

  credentials = {
    email: '',
    password:''
  }
  showAlert = false
  alertMsg = 'Please wait! We are logging you in.'
  alertColor = 'blue'
  inSubmission = false

 async login(){
  this.showAlert = true
  this.alertMsg = 'Logging in ...'
  this.alertColor = 'blue'
  this.inSubmission = true

  try {
    await this.auth.signInWithEmailAndPassword(
      this.credentials.email as string, this.credentials.password as string
    )
  } catch (error) {
   this.inSubmission = false
      this.alertMsg = 'An unexpected error occurred. Please try again later.'
      this.alertColor = 'red'

      console.log(error)

      return 
    }

    this.alertMsg = 'Success! You are now logged in.'
    this.alertColor = 'green'
 }

}
