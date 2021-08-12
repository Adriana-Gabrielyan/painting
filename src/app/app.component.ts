import { Component, OnInit } from '@angular/core';
import { IUser } from './models/user.interface';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  currentUser!: IUser;

  constructor(private authService: AuthService) {
    // this.currentUser = authService.currentUser as IUser;
  }

  ngOnInit(): void {
    this.authService.checkIsLoggedIn();
  }
  logout() {
    this.authService.logout();
  }
}
