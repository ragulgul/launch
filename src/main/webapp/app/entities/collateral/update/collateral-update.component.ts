import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICollateral, Collateral } from '../collateral.model';
import { CollateralService } from '../service/collateral.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IWorkflow } from 'app/entities/workflow/workflow.model';
import { WorkflowService } from 'app/entities/workflow/service/workflow.service';
import { ILaunch } from 'app/entities/launch/launch.model';
import { LaunchService } from 'app/entities/launch/service/launch.service';

@Component({
  selector: 'jhi-collateral-update',
  templateUrl: './collateral-update.component.html',
})
export class CollateralUpdateComponent implements OnInit {
  isSaving = false;

  workflowsCollection: IWorkflow[] = [];
  launchesSharedCollection: ILaunch[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [],
    icon: [],
    iconContentType: [],
    content: [],
    contentContentType: [],
    version: [],
    workflow: [],
    launch: [null, Validators.required],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected collateralService: CollateralService,
    protected workflowService: WorkflowService,
    protected launchService: LaunchService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ collateral }) => {
      this.updateForm(collateral);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('launchApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const collateral = this.createFromForm();
    if (collateral.id !== undefined) {
      this.subscribeToSaveResponse(this.collateralService.update(collateral));
    } else {
      this.subscribeToSaveResponse(this.collateralService.create(collateral));
    }
  }

  trackWorkflowById(index: number, item: IWorkflow): number {
    return item.id!;
  }

  trackLaunchById(index: number, item: ILaunch): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICollateral>>): void {
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

  protected updateForm(collateral: ICollateral): void {
    this.editForm.patchValue({
      id: collateral.id,
      name: collateral.name,
      description: collateral.description,
      icon: collateral.icon,
      iconContentType: collateral.iconContentType,
      content: collateral.content,
      contentContentType: collateral.contentContentType,
      version: collateral.version,
      workflow: collateral.workflow,
      launch: collateral.launch,
    });

    this.workflowsCollection = this.workflowService.addWorkflowToCollectionIfMissing(this.workflowsCollection, collateral.workflow);
    this.launchesSharedCollection = this.launchService.addLaunchToCollectionIfMissing(this.launchesSharedCollection, collateral.launch);
  }

  protected loadRelationshipsOptions(): void {
    this.workflowService
      .query({ filter: 'collateral-is-null' })
      .pipe(map((res: HttpResponse<IWorkflow[]>) => res.body ?? []))
      .pipe(
        map((workflows: IWorkflow[]) =>
          this.workflowService.addWorkflowToCollectionIfMissing(workflows, this.editForm.get('workflow')!.value)
        )
      )
      .subscribe((workflows: IWorkflow[]) => (this.workflowsCollection = workflows));

    this.launchService
      .query()
      .pipe(map((res: HttpResponse<ILaunch[]>) => res.body ?? []))
      .pipe(map((launches: ILaunch[]) => this.launchService.addLaunchToCollectionIfMissing(launches, this.editForm.get('launch')!.value)))
      .subscribe((launches: ILaunch[]) => (this.launchesSharedCollection = launches));
  }

  protected createFromForm(): ICollateral {
    return {
      ...new Collateral(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      iconContentType: this.editForm.get(['iconContentType'])!.value,
      icon: this.editForm.get(['icon'])!.value,
      contentContentType: this.editForm.get(['contentContentType'])!.value,
      content: this.editForm.get(['content'])!.value,
      version: this.editForm.get(['version'])!.value,
      workflow: this.editForm.get(['workflow'])!.value,
      launch: this.editForm.get(['launch'])!.value,
    };
  }
}
