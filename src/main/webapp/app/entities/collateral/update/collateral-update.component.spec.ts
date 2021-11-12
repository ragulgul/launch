jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CollateralService } from '../service/collateral.service';
import { ICollateral, Collateral } from '../collateral.model';
import { IWorkflow } from 'app/entities/workflow/workflow.model';
import { WorkflowService } from 'app/entities/workflow/service/workflow.service';
import { ILaunch } from 'app/entities/launch/launch.model';
import { LaunchService } from 'app/entities/launch/service/launch.service';

import { CollateralUpdateComponent } from './collateral-update.component';

describe('Collateral Management Update Component', () => {
  let comp: CollateralUpdateComponent;
  let fixture: ComponentFixture<CollateralUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let collateralService: CollateralService;
  let workflowService: WorkflowService;
  let launchService: LaunchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CollateralUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(CollateralUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CollateralUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    collateralService = TestBed.inject(CollateralService);
    workflowService = TestBed.inject(WorkflowService);
    launchService = TestBed.inject(LaunchService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call workflow query and add missing value', () => {
      const collateral: ICollateral = { id: 456 };
      const workflow: IWorkflow = { id: 33434 };
      collateral.workflow = workflow;

      const workflowCollection: IWorkflow[] = [{ id: 82065 }];
      jest.spyOn(workflowService, 'query').mockReturnValue(of(new HttpResponse({ body: workflowCollection })));
      const expectedCollection: IWorkflow[] = [workflow, ...workflowCollection];
      jest.spyOn(workflowService, 'addWorkflowToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ collateral });
      comp.ngOnInit();

      expect(workflowService.query).toHaveBeenCalled();
      expect(workflowService.addWorkflowToCollectionIfMissing).toHaveBeenCalledWith(workflowCollection, workflow);
      expect(comp.workflowsCollection).toEqual(expectedCollection);
    });

    it('Should call Launch query and add missing value', () => {
      const collateral: ICollateral = { id: 456 };
      const launch: ILaunch = { id: 519 };
      collateral.launch = launch;

      const launchCollection: ILaunch[] = [{ id: 55453 }];
      jest.spyOn(launchService, 'query').mockReturnValue(of(new HttpResponse({ body: launchCollection })));
      const additionalLaunches = [launch];
      const expectedCollection: ILaunch[] = [...additionalLaunches, ...launchCollection];
      jest.spyOn(launchService, 'addLaunchToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ collateral });
      comp.ngOnInit();

      expect(launchService.query).toHaveBeenCalled();
      expect(launchService.addLaunchToCollectionIfMissing).toHaveBeenCalledWith(launchCollection, ...additionalLaunches);
      expect(comp.launchesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const collateral: ICollateral = { id: 456 };
      const workflow: IWorkflow = { id: 82147 };
      collateral.workflow = workflow;
      const launch: ILaunch = { id: 51947 };
      collateral.launch = launch;

      activatedRoute.data = of({ collateral });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(collateral));
      expect(comp.workflowsCollection).toContain(workflow);
      expect(comp.launchesSharedCollection).toContain(launch);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Collateral>>();
      const collateral = { id: 123 };
      jest.spyOn(collateralService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ collateral });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: collateral }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(collateralService.update).toHaveBeenCalledWith(collateral);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Collateral>>();
      const collateral = new Collateral();
      jest.spyOn(collateralService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ collateral });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: collateral }));
      saveSubject.complete();

      // THEN
      expect(collateralService.create).toHaveBeenCalledWith(collateral);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Collateral>>();
      const collateral = { id: 123 };
      jest.spyOn(collateralService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ collateral });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(collateralService.update).toHaveBeenCalledWith(collateral);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackWorkflowById', () => {
      it('Should return tracked Workflow primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackWorkflowById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackLaunchById', () => {
      it('Should return tracked Launch primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLaunchById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
