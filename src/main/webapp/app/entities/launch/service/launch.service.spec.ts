import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILaunch, Launch } from '../launch.model';

import { LaunchService } from './launch.service';

describe('Launch Service', () => {
  let service: LaunchService;
  let httpMock: HttpTestingController;
  let elemDefault: ILaunch;
  let expectedResult: ILaunch | ILaunch[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LaunchService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
      start: currentDate,
      version: 0,
      iconContentType: 'image/png',
      icon: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          start: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Launch', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          start: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          start: currentDate,
        },
        returnedFromService
      );

      service.create(new Launch()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Launch', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          start: currentDate.format(DATE_TIME_FORMAT),
          version: 1,
          icon: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          start: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Launch', () => {
      const patchObject = Object.assign(
        {
          start: currentDate.format(DATE_TIME_FORMAT),
          version: 1,
          icon: 'BBBBBB',
        },
        new Launch()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          start: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Launch', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          start: currentDate.format(DATE_TIME_FORMAT),
          version: 1,
          icon: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          start: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Launch', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLaunchToCollectionIfMissing', () => {
      it('should add a Launch to an empty array', () => {
        const launch: ILaunch = { id: 123 };
        expectedResult = service.addLaunchToCollectionIfMissing([], launch);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(launch);
      });

      it('should not add a Launch to an array that contains it', () => {
        const launch: ILaunch = { id: 123 };
        const launchCollection: ILaunch[] = [
          {
            ...launch,
          },
          { id: 456 },
        ];
        expectedResult = service.addLaunchToCollectionIfMissing(launchCollection, launch);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Launch to an array that doesn't contain it", () => {
        const launch: ILaunch = { id: 123 };
        const launchCollection: ILaunch[] = [{ id: 456 }];
        expectedResult = service.addLaunchToCollectionIfMissing(launchCollection, launch);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(launch);
      });

      it('should add only unique Launch to an array', () => {
        const launchArray: ILaunch[] = [{ id: 123 }, { id: 456 }, { id: 56356 }];
        const launchCollection: ILaunch[] = [{ id: 123 }];
        expectedResult = service.addLaunchToCollectionIfMissing(launchCollection, ...launchArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const launch: ILaunch = { id: 123 };
        const launch2: ILaunch = { id: 456 };
        expectedResult = service.addLaunchToCollectionIfMissing([], launch, launch2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(launch);
        expect(expectedResult).toContain(launch2);
      });

      it('should accept null and undefined values', () => {
        const launch: ILaunch = { id: 123 };
        expectedResult = service.addLaunchToCollectionIfMissing([], null, launch, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(launch);
      });

      it('should return initial array if no Launch is added', () => {
        const launchCollection: ILaunch[] = [{ id: 123 }];
        expectedResult = service.addLaunchToCollectionIfMissing(launchCollection, undefined, null);
        expect(expectedResult).toEqual(launchCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
