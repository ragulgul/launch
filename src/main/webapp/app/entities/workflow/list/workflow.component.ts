import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IWorkflow } from '../workflow.model';
import { WorkflowService } from '../service/workflow.service';
import { WorkflowDeleteDialogComponent } from '../delete/workflow-delete-dialog.component';

@Component({
  selector: 'jhi-workflow',
  templateUrl: './workflow.component.html',
})
export class WorkflowComponent implements OnInit {
  workflows?: IWorkflow[];
  isLoading = false;

  constructor(protected workflowService: WorkflowService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.workflowService.query().subscribe(
      (res: HttpResponse<IWorkflow[]>) => {
        this.isLoading = false;
        this.workflows = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IWorkflow): number {
    return item.id!;
  }

  delete(workflow: IWorkflow): void {
    const modalRef = this.modalService.open(WorkflowDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.workflow = workflow;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
