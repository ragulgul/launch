import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICollateral, Collateral } from '../collateral.model';

import { CollateralService } from './collateral.service';

describe('Collateral Service', () => {
  let service: CollateralService;
  let httpMock: HttpTestingController;
  let elemDefault: ICollateral;
  let expectedResult: ICollateral | ICollateral[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CollateralService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
      iconContentType: 'image/png',
      icon: 'AAAAAAA',
      contentContentType: 'image/png',
      content: 'AAAAAAA',
      version: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Collateral', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Collateral()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Collateral', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          icon: 'BBBBBB',
          content: 'BBBBBB',
          version: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Collateral', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          description: 'BBBBBB',
          icon: 'BBBBBB',
          content: 'BBBBBB',
        },
        new Collateral()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Collateral', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          icon: 'BBBBBB',
          content: 'BBBBBB',
          version: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Collateral', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCollateralToCollectionIfMissing', () => {
      it('should add a Collateral to an empty array', () => {
        const collateral: ICollateral = { id: 123 };
        expectedResult = service.addCollateralToCollectionIfMissing([], collateral);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(collateral);
      });

      it('should not add a Collateral to an array that contains it', () => {
        const collateral: ICollateral = { id: 123 };
        const collateralCollection: ICollateral[] = [
          {
            ...collateral,
          },
          { id: 456 },
        ];
        expectedResult = service.addCollateralToCollectionIfMissing(collateralCollection, collateral);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Collateral to an array that doesn't contain it", () => {
        const collateral: ICollateral = { id: 123 };
        const collateralCollection: ICollateral[] = [{ id: 456 }];
        expectedResult = service.addCollateralToCollectionIfMissing(collateralCollection, collateral);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(collateral);
      });

      it('should add only unique Collateral to an array', () => {
        const collateralArray: ICollateral[] = [{ id: 123 }, { id: 456 }, { id: 64092 }];
        const collateralCollection: ICollateral[] = [{ id: 123 }];
        expectedResult = service.addCollateralToCollectionIfMissing(collateralCollection, ...collateralArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const collateral: ICollateral = { id: 123 };
        const collateral2: ICollateral = { id: 456 };
        expectedResult = service.addCollateralToCollectionIfMissing([], collateral, collateral2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(collateral);
        expect(expectedResult).toContain(collateral2);
      });

      it('should accept null and undefined values', () => {
        const collateral: ICollateral = { id: 123 };
        expectedResult = service.addCollateralToCollectionIfMissing([], null, collateral, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(collateral);
      });

      it('should return initial array if no Collateral is added', () => {
        const collateralCollection: ICollateral[] = [{ id: 123 }];
        expectedResult = service.addCollateralToCollectionIfMissing(collateralCollection, undefined, null);
        expect(expectedResult).toEqual(collateralCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
