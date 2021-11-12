jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILaunch, Launch } from '../launch.model';
import { LaunchService } from '../service/launch.service';

import { LaunchRoutingResolveService } from './launch-routing-resolve.service';

describe('Launch routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: LaunchRoutingResolveService;
  let service: LaunchService;
  let resultLaunch: ILaunch | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(LaunchRoutingResolveService);
    service = TestBed.inject(LaunchService);
    resultLaunch = undefined;
  });

  describe('resolve', () => {
    it('should return ILaunch returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLaunch = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLaunch).toEqual({ id: 123 });
    });

    it('should return new ILaunch if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLaunch = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultLaunch).toEqual(new Launch());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Launch })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLaunch = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLaunch).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
