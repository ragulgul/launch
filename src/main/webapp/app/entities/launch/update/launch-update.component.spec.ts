jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LaunchService } from '../service/launch.service';
import { ILaunch, Launch } from '../launch.model';
import { IWorkflow } from 'app/entities/workflow/workflow.model';
import { WorkflowService } from 'app/entities/workflow/service/workflow.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

import { LaunchUpdateComponent } from './launch-update.component';

describe('Launch Management Update Component', () => {
  let comp: LaunchUpdateComponent;
  let fixture: ComponentFixture<LaunchUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let launchService: LaunchService;
  let workflowService: WorkflowService;
  let productService: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LaunchUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(LaunchUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LaunchUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    launchService = TestBed.inject(LaunchService);
    workflowService = TestBed.inject(WorkflowService);
    productService = TestBed.inject(ProductService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call workflow query and add missing value', () => {
      const launch: ILaunch = { id: 456 };
      const workflow: IWorkflow = { id: 24563 };
      launch.workflow = workflow;

      const workflowCollection: IWorkflow[] = [{ id: 26713 }];
      jest.spyOn(workflowService, 'query').mockReturnValue(of(new HttpResponse({ body: workflowCollection })));
      const expectedCollection: IWorkflow[] = [workflow, ...workflowCollection];
      jest.spyOn(workflowService, 'addWorkflowToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ launch });
      comp.ngOnInit();

      expect(workflowService.query).toHaveBeenCalled();
      expect(workflowService.addWorkflowToCollectionIfMissing).toHaveBeenCalledWith(workflowCollection, workflow);
      expect(comp.workflowsCollection).toEqual(expectedCollection);
    });

    it('Should call Product query and add missing value', () => {
      const launch: ILaunch = { id: 456 };
      const product: IProduct = { id: 86942 };
      launch.product = product;

      const productCollection: IProduct[] = [{ id: 67254 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ launch });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const launch: ILaunch = { id: 456 };
      const workflow: IWorkflow = { id: 95258 };
      launch.workflow = workflow;
      const product: IProduct = { id: 62624 };
      launch.product = product;

      activatedRoute.data = of({ launch });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(launch));
      expect(comp.workflowsCollection).toContain(workflow);
      expect(comp.productsSharedCollection).toContain(product);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Launch>>();
      const launch = { id: 123 };
      jest.spyOn(launchService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ launch });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: launch }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(launchService.update).toHaveBeenCalledWith(launch);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Launch>>();
      const launch = new Launch();
      jest.spyOn(launchService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ launch });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: launch }));
      saveSubject.complete();

      // THEN
      expect(launchService.create).toHaveBeenCalledWith(launch);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Launch>>();
      const launch = { id: 123 };
      jest.spyOn(launchService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ launch });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(launchService.update).toHaveBeenCalledWith(launch);
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

    describe('trackProductById', () => {
      it('Should return tracked Product primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
