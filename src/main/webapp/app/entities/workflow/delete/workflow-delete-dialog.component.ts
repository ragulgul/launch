import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IWorkflow } from '../workflow.model';
import { WorkflowService } from '../service/workflow.service';

@Component({
  templateUrl: './workflow-delete-dialog.component.html',
})
export class WorkflowDeleteDialogComponent {
  workflow?: IWorkflow;

  constructor(protected workflowService: WorkflowService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.workflowService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
