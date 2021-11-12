import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProductLine, ProductLine } from '../product-line.model';

import { ProductLineService } from './product-line.service';

describe('ProductLine Service', () => {
  let service: ProductLineService;
  let httpMock: HttpTestingController;
  let elemDefault: IProductLine;
  let expectedResult: IProductLine | IProductLine[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductLineService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
      iconContentType: 'image/png',
      icon: 'AAAAAAA',
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

    it('should create a ProductLine', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ProductLine()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductLine', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          icon: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProductLine', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          description: 'BBBBBB',
        },
        new ProductLine()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProductLine', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          icon: 'BBBBBB',
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

    it('should delete a ProductLine', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProductLineToCollectionIfMissing', () => {
      it('should add a ProductLine to an empty array', () => {
        const productLine: IProductLine = { id: 123 };
        expectedResult = service.addProductLineToCollectionIfMissing([], productLine);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productLine);
      });

      it('should not add a ProductLine to an array that contains it', () => {
        const productLine: IProductLine = { id: 123 };
        const productLineCollection: IProductLine[] = [
          {
            ...productLine,
          },
          { id: 456 },
        ];
        expectedResult = service.addProductLineToCollectionIfMissing(productLineCollection, productLine);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductLine to an array that doesn't contain it", () => {
        const productLine: IProductLine = { id: 123 };
        const productLineCollection: IProductLine[] = [{ id: 456 }];
        expectedResult = service.addProductLineToCollectionIfMissing(productLineCollection, productLine);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productLine);
      });

      it('should add only unique ProductLine to an array', () => {
        const productLineArray: IProductLine[] = [{ id: 123 }, { id: 456 }, { id: 12759 }];
        const productLineCollection: IProductLine[] = [{ id: 123 }];
        expectedResult = service.addProductLineToCollectionIfMissing(productLineCollection, ...productLineArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productLine: IProductLine = { id: 123 };
        const productLine2: IProductLine = { id: 456 };
        expectedResult = service.addProductLineToCollectionIfMissing([], productLine, productLine2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productLine);
        expect(expectedResult).toContain(productLine2);
      });

      it('should accept null and undefined values', () => {
        const productLine: IProductLine = { id: 123 };
        expectedResult = service.addProductLineToCollectionIfMissing([], null, productLine, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productLine);
      });

      it('should return initial array if no ProductLine is added', () => {
        const productLineCollection: IProductLine[] = [{ id: 123 }];
        expectedResult = service.addProductLineToCollectionIfMissing(productLineCollection, undefined, null);
        expect(expectedResult).toEqual(productLineCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
