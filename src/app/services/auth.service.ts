import { Injectable } from '@angular/core';
import { IUser } from '../models/user.interface';
import { LocalStorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser!: IUser | undefined;
  users: IUser[] = [];

  constructor(private storage: LocalStorageService, private router: Router) {
    // this.currentUser = JSON.parse(storage.get('currentUser') || '{}');
  }

  register(user: IUser) {
    const users = this.storage.get('users');

    if (users) {
      this.users = JSON.parse(users);
    }

    this.users.push(user);

    const usersStr = JSON.stringify(this.users);
    this.storage.set('users', usersStr);
    this.router.navigate(['/login']);
  }

  login(email: string, password: string) {
    const users = this.storage.get('users');
    if (users) {
      this.users = JSON.parse(users);
    }

    this.currentUser = this.users.find((user) => {
      return user.email === email && user.password === password;
    });

    if (this.currentUser) {
      const currentUser = JSON.stringify(this.currentUser);
      this.storage.set('currentUser', currentUser);
      this.router.navigate(['/']);
    }
  }

  checkIsLoggedIn() {
    const currentUser = this.storage.get('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }
  logout() {
    this.storage.remove('currentUser');
    this.router.navigate(['/login']);
  }
}
