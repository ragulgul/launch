import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WorkflowComponent } from './list/workflow.component';
import { WorkflowDetailComponent } from './detail/workflow-detail.component';
import { WorkflowUpdateComponent } from './update/workflow-update.component';
import { WorkflowDeleteDialogComponent } from './delete/workflow-delete-dialog.component';
import { WorkflowRoutingModule } from './route/workflow-routing.module';

@NgModule({
  imports: [SharedModule, WorkflowRoutingModule],
  declarations: [WorkflowComponent, WorkflowDetailComponent, WorkflowUpdateComponent, WorkflowDeleteDialogComponent],
  entryComponents: [WorkflowDeleteDialogComponent],
})
export class WorkflowModule {}
