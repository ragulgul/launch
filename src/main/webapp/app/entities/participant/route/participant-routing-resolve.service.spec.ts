jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IParticipant, Participant } from '../participant.model';
import { ParticipantService } from '../service/participant.service';

import { ParticipantRoutingResolveService } from './participant-routing-resolve.service';

describe('Participant routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ParticipantRoutingResolveService;
  let service: ParticipantService;
  let resultParticipant: IParticipant | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ParticipantRoutingResolveService);
    service = TestBed.inject(ParticipantService);
    resultParticipant = undefined;
  });

  describe('resolve', () => {
    it('should return IParticipant returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParticipant = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultParticipant).toEqual({ id: 123 });
    });

    it('should return new IParticipant if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParticipant = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultParticipant).toEqual(new Participant());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Participant })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParticipant = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultParticipant).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
