import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CollateralComponent } from '../list/collateral.component';
import { CollateralDetailComponent } from '../detail/collateral-detail.component';
import { CollateralUpdateComponent } from '../update/collateral-update.component';
import { CollateralRoutingResolveService } from './collateral-routing-resolve.service';

const collateralRoute: Routes = [
  {
    path: '',
    component: CollateralComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CollateralDetailComponent,
    resolve: {
      collateral: CollateralRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CollateralUpdateComponent,
    resolve: {
      collateral: CollateralRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CollateralUpdateComponent,
    resolve: {
      collateral: CollateralRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(collateralRoute)],
  exports: [RouterModule],
})
export class CollateralRoutingModule {}
