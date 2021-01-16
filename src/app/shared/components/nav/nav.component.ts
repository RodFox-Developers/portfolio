import { User } from './../../../core/auth/models/user';
import { Router } from '@angular/router';
import { AuthService } from './../../../core/auth/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy{

  currentUser: User;
  userSubscription: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    private router: Router
    ) {}

    ngOnInit() {
      this.userSubscription = this.authService.user$.subscribe(user => {
        if (user) {
          this.currentUser = user;
        } else {
          this.router.navigate(['home']);
        }
      });
    }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onSignOut() {
    this.authService.signOut();
  }

}
