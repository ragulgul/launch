jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProductLine, ProductLine } from '../product-line.model';
import { ProductLineService } from '../service/product-line.service';

import { ProductLineRoutingResolveService } from './product-line-routing-resolve.service';

describe('ProductLine routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ProductLineRoutingResolveService;
  let service: ProductLineService;
  let resultProductLine: IProductLine | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ProductLineRoutingResolveService);
    service = TestBed.inject(ProductLineService);
    resultProductLine = undefined;
  });

  describe('resolve', () => {
    it('should return IProductLine returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProductLine = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProductLine).toEqual({ id: 123 });
    });

    it('should return new IProductLine if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProductLine = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultProductLine).toEqual(new ProductLine());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ProductLine })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProductLine = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProductLine).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
