import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IWorkflow, Workflow } from '../workflow.model';
import { WorkflowService } from '../service/workflow.service';

@Component({
  selector: 'jhi-workflow-update',
  templateUrl: './workflow-update.component.html',
})
export class WorkflowUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [],
  });

  constructor(protected workflowService: WorkflowService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workflow }) => {
      this.updateForm(workflow);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const workflow = this.createFromForm();
    if (workflow.id !== undefined) {
      this.subscribeToSaveResponse(this.workflowService.update(workflow));
    } else {
      this.subscribeToSaveResponse(this.workflowService.create(workflow));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWorkflow>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(workflow: IWorkflow): void {
    this.editForm.patchValue({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
    });
  }

  protected createFromForm(): IWorkflow {
    return {
      ...new Workflow(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
