import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParticipantComponent } from './list/participant.component';
import { ParticipantDetailComponent } from './detail/participant-detail.component';
import { ParticipantUpdateComponent } from './update/participant-update.component';
import { ParticipantDeleteDialogComponent } from './delete/participant-delete-dialog.component';
import { ParticipantRoutingModule } from './route/participant-routing.module';

@NgModule({
  imports: [SharedModule, ParticipantRoutingModule],
  declarations: [ParticipantComponent, ParticipantDetailComponent, ParticipantUpdateComponent, ParticipantDeleteDialogComponent],
  entryComponents: [ParticipantDeleteDialogComponent],
})
export class ParticipantModule {}
