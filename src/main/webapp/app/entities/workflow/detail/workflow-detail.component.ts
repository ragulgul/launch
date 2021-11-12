import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWorkflow } from '../workflow.model';

@Component({
  selector: 'jhi-workflow-detail',
  templateUrl: './workflow-detail.component.html',
})
export class WorkflowDetailComponent implements OnInit {
  workflow: IWorkflow | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workflow }) => {
      this.workflow = workflow;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
