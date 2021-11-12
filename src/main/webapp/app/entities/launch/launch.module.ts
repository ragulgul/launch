import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LaunchComponent } from './list/launch.component';
import { LaunchDetailComponent } from './detail/launch-detail.component';
import { LaunchUpdateComponent } from './update/launch-update.component';
import { LaunchDeleteDialogComponent } from './delete/launch-delete-dialog.component';
import { LaunchRoutingModule } from './route/launch-routing.module';

@NgModule({
  imports: [SharedModule, LaunchRoutingModule],
  declarations: [LaunchComponent, LaunchDetailComponent, LaunchUpdateComponent, LaunchDeleteDialogComponent],
  entryComponents: [LaunchDeleteDialogComponent],
})
export class LaunchModule {}
