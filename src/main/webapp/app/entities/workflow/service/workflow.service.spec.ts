import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IWorkflow, Workflow } from '../workflow.model';

import { WorkflowService } from './workflow.service';

describe('Workflow Service', () => {
  let service: WorkflowService;
  let httpMock: HttpTestingController;
  let elemDefault: IWorkflow;
  let expectedResult: IWorkflow | IWorkflow[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WorkflowService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
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

    it('should create a Workflow', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Workflow()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Workflow', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Workflow', () => {
      const patchObject = Object.assign(
        {
          description: 'BBBBBB',
        },
        new Workflow()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Workflow', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
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

    it('should delete a Workflow', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addWorkflowToCollectionIfMissing', () => {
      it('should add a Workflow to an empty array', () => {
        const workflow: IWorkflow = { id: 123 };
        expectedResult = service.addWorkflowToCollectionIfMissing([], workflow);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(workflow);
      });

      it('should not add a Workflow to an array that contains it', () => {
        const workflow: IWorkflow = { id: 123 };
        const workflowCollection: IWorkflow[] = [
          {
            ...workflow,
          },
          { id: 456 },
        ];
        expectedResult = service.addWorkflowToCollectionIfMissing(workflowCollection, workflow);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Workflow to an array that doesn't contain it", () => {
        const workflow: IWorkflow = { id: 123 };
        const workflowCollection: IWorkflow[] = [{ id: 456 }];
        expectedResult = service.addWorkflowToCollectionIfMissing(workflowCollection, workflow);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(workflow);
      });

      it('should add only unique Workflow to an array', () => {
        const workflowArray: IWorkflow[] = [{ id: 123 }, { id: 456 }, { id: 65208 }];
        const workflowCollection: IWorkflow[] = [{ id: 123 }];
        expectedResult = service.addWorkflowToCollectionIfMissing(workflowCollection, ...workflowArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const workflow: IWorkflow = { id: 123 };
        const workflow2: IWorkflow = { id: 456 };
        expectedResult = service.addWorkflowToCollectionIfMissing([], workflow, workflow2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(workflow);
        expect(expectedResult).toContain(workflow2);
      });

      it('should accept null and undefined values', () => {
        const workflow: IWorkflow = { id: 123 };
        expectedResult = service.addWorkflowToCollectionIfMissing([], null, workflow, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(workflow);
      });

      it('should return initial array if no Workflow is added', () => {
        const workflowCollection: IWorkflow[] = [{ id: 123 }];
        expectedResult = service.addWorkflowToCollectionIfMissing(workflowCollection, undefined, null);
        expect(expectedResult).toEqual(workflowCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
