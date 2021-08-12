import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IUser } from '../models/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  // @Input() currentUser = {} as IUser;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
 
  }

  logout() {
    this.authService.logout();
  }
}
