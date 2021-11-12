jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IWorkflow, Workflow } from '../workflow.model';
import { WorkflowService } from '../service/workflow.service';

import { WorkflowRoutingResolveService } from './workflow-routing-resolve.service';

describe('Workflow routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: WorkflowRoutingResolveService;
  let service: WorkflowService;
  let resultWorkflow: IWorkflow | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(WorkflowRoutingResolveService);
    service = TestBed.inject(WorkflowService);
    resultWorkflow = undefined;
  });

  describe('resolve', () => {
    it('should return IWorkflow returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultWorkflow = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultWorkflow).toEqual({ id: 123 });
    });

    it('should return new IWorkflow if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultWorkflow = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultWorkflow).toEqual(new Workflow());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Workflow })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultWorkflow = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultWorkflow).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
