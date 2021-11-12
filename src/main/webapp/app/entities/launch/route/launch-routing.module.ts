import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LaunchComponent } from '../list/launch.component';
import { LaunchDetailComponent } from '../detail/launch-detail.component';
import { LaunchUpdateComponent } from '../update/launch-update.component';
import { LaunchRoutingResolveService } from './launch-routing-resolve.service';

const launchRoute: Routes = [
  {
    path: '',
    component: LaunchComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LaunchDetailComponent,
    resolve: {
      launch: LaunchRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LaunchUpdateComponent,
    resolve: {
      launch: LaunchRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LaunchUpdateComponent,
    resolve: {
      launch: LaunchRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(launchRoute)],
  exports: [RouterModule],
})
export class LaunchRoutingModule {}
