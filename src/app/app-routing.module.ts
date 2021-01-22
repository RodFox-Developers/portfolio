import { StatsComponent } from './features/stats/stats.component';
import { EarningsComponent } from './features/earnings/earnings.component';
import { AuthGuardService } from './core/auth/services/auth-guard.service';
import { NavComponent } from './shared/components/nav/nav.component';
import { HomeComponent } from './features/home/home.component';
import { HoldingsComponent } from './features/holdings/holdings.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'nav', component: NavComponent, children: [
    { path: '', redirectTo: '/nav/stats', pathMatch: 'full' },
    { path: 'stats', component: StatsComponent },
    { path: 'holdings', component: HoldingsComponent },
    { path: 'earnings', component: EarningsComponent }
  ], canActivate: [AuthGuardService] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
