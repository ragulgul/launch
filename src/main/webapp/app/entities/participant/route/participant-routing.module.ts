import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParticipantComponent } from '../list/participant.component';
import { ParticipantDetailComponent } from '../detail/participant-detail.component';
import { ParticipantUpdateComponent } from '../update/participant-update.component';
import { ParticipantRoutingResolveService } from './participant-routing-resolve.service';

const participantRoute: Routes = [
  {
    path: '',
    component: ParticipantComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParticipantDetailComponent,
    resolve: {
      participant: ParticipantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParticipantUpdateComponent,
    resolve: {
      participant: ParticipantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParticipantUpdateComponent,
    resolve: {
      participant: ParticipantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(participantRoute)],
  exports: [RouterModule],
})
export class ParticipantRoutingModule {}
