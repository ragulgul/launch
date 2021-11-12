import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProductLineComponent } from '../list/product-line.component';
import { ProductLineDetailComponent } from '../detail/product-line-detail.component';
import { ProductLineUpdateComponent } from '../update/product-line-update.component';
import { ProductLineRoutingResolveService } from './product-line-routing-resolve.service';

const productLineRoute: Routes = [
  {
    path: '',
    component: ProductLineComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductLineDetailComponent,
    resolve: {
      productLine: ProductLineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductLineUpdateComponent,
    resolve: {
      productLine: ProductLineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductLineUpdateComponent,
    resolve: {
      productLine: ProductLineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productLineRoute)],
  exports: [RouterModule],
})
export class ProductLineRoutingModule {}
