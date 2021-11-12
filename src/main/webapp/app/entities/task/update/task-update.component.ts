import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITask, Task } from '../task.model';
import { TaskService } from '../service/task.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';
import { IWorkflow } from 'app/entities/workflow/workflow.model';
import { WorkflowService } from 'app/entities/workflow/service/workflow.service';

@Component({
  selector: 'jhi-task-update',
  templateUrl: './task-update.component.html',
})
export class TaskUpdateComponent implements OnInit {
  isSaving = false;

  assignedTosCollection: ITeam[] = [];
  workflowsSharedCollection: IWorkflow[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [],
    assignedTo: [],
    workflow: [null, Validators.required],
  });

  constructor(
    protected taskService: TaskService,
    protected teamService: TeamService,
    protected workflowService: WorkflowService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ task }) => {
      this.updateForm(task);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const task = this.createFromForm();
    if (task.id !== undefined) {
      this.subscribeToSaveResponse(this.taskService.update(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.create(task));
    }
  }

  trackTeamById(index: number, item: ITeam): number {
    return item.id!;
  }

  trackWorkflowById(index: number, item: IWorkflow): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITask>>): void {
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

  protected updateForm(task: ITask): void {
    this.editForm.patchValue({
      id: task.id,
      name: task.name,
      description: task.description,
      assignedTo: task.assignedTo,
      workflow: task.workflow,
    });

    this.assignedTosCollection = this.teamService.addTeamToCollectionIfMissing(this.assignedTosCollection, task.assignedTo);
    this.workflowsSharedCollection = this.workflowService.addWorkflowToCollectionIfMissing(this.workflowsSharedCollection, task.workflow);
  }

  protected loadRelationshipsOptions(): void {
    this.teamService
      .query({ filter: 'task-is-null' })
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.teamService.addTeamToCollectionIfMissing(teams, this.editForm.get('assignedTo')!.value)))
      .subscribe((teams: ITeam[]) => (this.assignedTosCollection = teams));

    this.workflowService
      .query()
      .pipe(map((res: HttpResponse<IWorkflow[]>) => res.body ?? []))
      .pipe(
        map((workflows: IWorkflow[]) =>
          this.workflowService.addWorkflowToCollectionIfMissing(workflows, this.editForm.get('workflow')!.value)
        )
      )
      .subscribe((workflows: IWorkflow[]) => (this.workflowsSharedCollection = workflows));
  }

  protected createFromForm(): ITask {
    return {
      ...new Task(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      assignedTo: this.editForm.get(['assignedTo'])!.value,
      workflow: this.editForm.get(['workflow'])!.value,
    };
  }
}
