jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TaskService } from '../service/task.service';
import { ITask, Task } from '../task.model';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';
import { IWorkflow } from 'app/entities/workflow/workflow.model';
import { WorkflowService } from 'app/entities/workflow/service/workflow.service';

import { TaskUpdateComponent } from './task-update.component';

describe('Task Management Update Component', () => {
  let comp: TaskUpdateComponent;
  let fixture: ComponentFixture<TaskUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let taskService: TaskService;
  let teamService: TeamService;
  let workflowService: WorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TaskUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(TaskUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TaskUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    taskService = TestBed.inject(TaskService);
    teamService = TestBed.inject(TeamService);
    workflowService = TestBed.inject(WorkflowService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call assignedTo query and add missing value', () => {
      const task: ITask = { id: 456 };
      const assignedTo: ITeam = { id: 9088 };
      task.assignedTo = assignedTo;

      const assignedToCollection: ITeam[] = [{ id: 50298 }];
      jest.spyOn(teamService, 'query').mockReturnValue(of(new HttpResponse({ body: assignedToCollection })));
      const expectedCollection: ITeam[] = [assignedTo, ...assignedToCollection];
      jest.spyOn(teamService, 'addTeamToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(teamService.query).toHaveBeenCalled();
      expect(teamService.addTeamToCollectionIfMissing).toHaveBeenCalledWith(assignedToCollection, assignedTo);
      expect(comp.assignedTosCollection).toEqual(expectedCollection);
    });

    it('Should call Workflow query and add missing value', () => {
      const task: ITask = { id: 456 };
      const workflow: IWorkflow = { id: 51878 };
      task.workflow = workflow;

      const workflowCollection: IWorkflow[] = [{ id: 14245 }];
      jest.spyOn(workflowService, 'query').mockReturnValue(of(new HttpResponse({ body: workflowCollection })));
      const additionalWorkflows = [workflow];
      const expectedCollection: IWorkflow[] = [...additionalWorkflows, ...workflowCollection];
      jest.spyOn(workflowService, 'addWorkflowToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(workflowService.query).toHaveBeenCalled();
      expect(workflowService.addWorkflowToCollectionIfMissing).toHaveBeenCalledWith(workflowCollection, ...additionalWorkflows);
      expect(comp.workflowsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const task: ITask = { id: 456 };
      const assignedTo: ITeam = { id: 53763 };
      task.assignedTo = assignedTo;
      const workflow: IWorkflow = { id: 60705 };
      task.workflow = workflow;

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(task));
      expect(comp.assignedTosCollection).toContain(assignedTo);
      expect(comp.workflowsSharedCollection).toContain(workflow);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Task>>();
      const task = { id: 123 };
      jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: task }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(taskService.update).toHaveBeenCalledWith(task);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Task>>();
      const task = new Task();
      jest.spyOn(taskService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: task }));
      saveSubject.complete();

      // THEN
      expect(taskService.create).toHaveBeenCalledWith(task);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Task>>();
      const task = { id: 123 };
      jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(taskService.update).toHaveBeenCalledWith(task);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTeamById', () => {
      it('Should return tracked Team primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTeamById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackWorkflowById', () => {
      it('Should return tracked Workflow primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackWorkflowById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
