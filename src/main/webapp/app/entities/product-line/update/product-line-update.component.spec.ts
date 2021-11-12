jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProductLineService } from '../service/product-line.service';
import { IProductLine, ProductLine } from '../product-line.model';

import { ProductLineUpdateComponent } from './product-line-update.component';

describe('ProductLine Management Update Component', () => {
  let comp: ProductLineUpdateComponent;
  let fixture: ComponentFixture<ProductLineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productLineService: ProductLineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProductLineUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ProductLineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductLineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productLineService = TestBed.inject(ProductLineService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const productLine: IProductLine = { id: 456 };

      activatedRoute.data = of({ productLine });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(productLine));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductLine>>();
      const productLine = { id: 123 };
      jest.spyOn(productLineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productLine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productLine }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(productLineService.update).toHaveBeenCalledWith(productLine);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductLine>>();
      const productLine = new ProductLine();
      jest.spyOn(productLineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productLine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productLine }));
      saveSubject.complete();

      // THEN
      expect(productLineService.create).toHaveBeenCalledWith(productLine);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductLine>>();
      const productLine = { id: 123 };
      jest.spyOn(productLineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productLine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productLineService.update).toHaveBeenCalledWith(productLine);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
