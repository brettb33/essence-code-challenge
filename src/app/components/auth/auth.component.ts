import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  constructor(private authSvc: AuthService) {}

  ngOnInit(): void {}

  loginWithGoogle() {
    this.authSvc.loginWithGoogle();
  }
}
