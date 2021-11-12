import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WorkflowComponent } from '../list/workflow.component';
import { WorkflowDetailComponent } from '../detail/workflow-detail.component';
import { WorkflowUpdateComponent } from '../update/workflow-update.component';
import { WorkflowRoutingResolveService } from './workflow-routing-resolve.service';

const workflowRoute: Routes = [
  {
    path: '',
    component: WorkflowComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WorkflowDetailComponent,
    resolve: {
      workflow: WorkflowRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WorkflowUpdateComponent,
    resolve: {
      workflow: WorkflowRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WorkflowUpdateComponent,
    resolve: {
      workflow: WorkflowRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(workflowRoute)],
  exports: [RouterModule],
})
export class WorkflowRoutingModule {}
