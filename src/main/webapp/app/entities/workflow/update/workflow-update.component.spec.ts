jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { WorkflowService } from '../service/workflow.service';
import { IWorkflow, Workflow } from '../workflow.model';

import { WorkflowUpdateComponent } from './workflow-update.component';

describe('Workflow Management Update Component', () => {
  let comp: WorkflowUpdateComponent;
  let fixture: ComponentFixture<WorkflowUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let workflowService: WorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [WorkflowUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(WorkflowUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorkflowUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    workflowService = TestBed.inject(WorkflowService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const workflow: IWorkflow = { id: 456 };

      activatedRoute.data = of({ workflow });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(workflow));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Workflow>>();
      const workflow = { id: 123 };
      jest.spyOn(workflowService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workflow });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: workflow }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(workflowService.update).toHaveBeenCalledWith(workflow);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Workflow>>();
      const workflow = new Workflow();
      jest.spyOn(workflowService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workflow });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: workflow }));
      saveSubject.complete();

      // THEN
      expect(workflowService.create).toHaveBeenCalledWith(workflow);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Workflow>>();
      const workflow = { id: 123 };
      jest.spyOn(workflowService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workflow });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(workflowService.update).toHaveBeenCalledWith(workflow);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
