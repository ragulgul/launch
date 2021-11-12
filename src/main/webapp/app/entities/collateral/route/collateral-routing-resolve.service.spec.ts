jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICollateral, Collateral } from '../collateral.model';
import { CollateralService } from '../service/collateral.service';

import { CollateralRoutingResolveService } from './collateral-routing-resolve.service';

describe('Collateral routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: CollateralRoutingResolveService;
  let service: CollateralService;
  let resultCollateral: ICollateral | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(CollateralRoutingResolveService);
    service = TestBed.inject(CollateralService);
    resultCollateral = undefined;
  });

  describe('resolve', () => {
    it('should return ICollateral returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCollateral = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCollateral).toEqual({ id: 123 });
    });

    it('should return new ICollateral if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCollateral = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultCollateral).toEqual(new Collateral());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Collateral })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCollateral = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCollateral).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
