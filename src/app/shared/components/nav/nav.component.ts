import { FundsDialogComponent } from './../balance/components/funds-dialog/funds-dialog.component';
import { User } from './../../../core/auth/models/user';
import { Router } from '@angular/router';
import { AuthService } from './../../../core/auth/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, mergeMap, shareReplay, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { HoldingsService } from 'src/app/features/holdings/services/holdings.service';

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
    private router: Router,
    public dialog: MatDialog,
    private holdingsService: HoldingsService,
    ) {}

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => {
      if (user) {
        this.currentUser = user;
      } else {
        this.router.navigate(['home']);
      }

      this.holdingsService.getAssetsList(user.uid)
      .pipe(
        take(1),
        mergeMap(a => {
          return a.map(action => {
            return this.holdingsService.getStockPrice(action.symbol)
              .pipe(
                map(data => {
                  action.price = data;
                  return action;
                })
              )
          })
        })
      )
      .subscribe(res => {
        res.subscribe(assets => {
          this.holdingsService.initAssetsList(assets);
        })
      });
    });
  }

  funds() {
    this.dialog.open(FundsDialogComponent);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onSignOut() {
    this.authService.signOut();
  }

}
