import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const requiresLogin = route.data.requiresLogin || false;
    if (requiresLogin) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
