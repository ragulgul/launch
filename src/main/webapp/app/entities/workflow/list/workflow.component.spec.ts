import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { WorkflowService } from '../service/workflow.service';

import { WorkflowComponent } from './workflow.component';

describe('Workflow Management Component', () => {
  let comp: WorkflowComponent;
  let fixture: ComponentFixture<WorkflowComponent>;
  let service: WorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [WorkflowComponent],
    })
      .overrideTemplate(WorkflowComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorkflowComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(WorkflowService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.workflows?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
