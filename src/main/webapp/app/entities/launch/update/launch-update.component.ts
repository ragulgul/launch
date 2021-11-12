import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ILaunch, Launch } from '../launch.model';
import { LaunchService } from '../service/launch.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IWorkflow } from 'app/entities/workflow/workflow.model';
import { WorkflowService } from 'app/entities/workflow/service/workflow.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

@Component({
  selector: 'jhi-launch-update',
  templateUrl: './launch-update.component.html',
})
export class LaunchUpdateComponent implements OnInit {
  isSaving = false;

  workflowsCollection: IWorkflow[] = [];
  productsSharedCollection: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [],
    start: [],
    version: [],
    icon: [],
    iconContentType: [],
    workflow: [],
    product: [null, Validators.required],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected launchService: LaunchService,
    protected workflowService: WorkflowService,
    protected productService: ProductService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ launch }) => {
      if (launch.id === undefined) {
        const today = dayjs().startOf('day');
        launch.start = today;
      }

      this.updateForm(launch);

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
    const launch = this.createFromForm();
    if (launch.id !== undefined) {
      this.subscribeToSaveResponse(this.launchService.update(launch));
    } else {
      this.subscribeToSaveResponse(this.launchService.create(launch));
    }
  }

  trackWorkflowById(index: number, item: IWorkflow): number {
    return item.id!;
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILaunch>>): void {
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

  protected updateForm(launch: ILaunch): void {
    this.editForm.patchValue({
      id: launch.id,
      name: launch.name,
      description: launch.description,
      start: launch.start ? launch.start.format(DATE_TIME_FORMAT) : null,
      version: launch.version,
      icon: launch.icon,
      iconContentType: launch.iconContentType,
      workflow: launch.workflow,
      product: launch.product,
    });

    this.workflowsCollection = this.workflowService.addWorkflowToCollectionIfMissing(this.workflowsCollection, launch.workflow);
    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(this.productsSharedCollection, launch.product);
  }

  protected loadRelationshipsOptions(): void {
    this.workflowService
      .query({ filter: 'launch-is-null' })
      .pipe(map((res: HttpResponse<IWorkflow[]>) => res.body ?? []))
      .pipe(
        map((workflows: IWorkflow[]) =>
          this.workflowService.addWorkflowToCollectionIfMissing(workflows, this.editForm.get('workflow')!.value)
        )
      )
      .subscribe((workflows: IWorkflow[]) => (this.workflowsCollection = workflows));

    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));
  }

  protected createFromForm(): ILaunch {
    return {
      ...new Launch(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      start: this.editForm.get(['start'])!.value ? dayjs(this.editForm.get(['start'])!.value, DATE_TIME_FORMAT) : undefined,
      version: this.editForm.get(['version'])!.value,
      iconContentType: this.editForm.get(['iconContentType'])!.value,
      icon: this.editForm.get(['icon'])!.value,
      workflow: this.editForm.get(['workflow'])!.value,
      product: this.editForm.get(['product'])!.value,
    };
  }
}
