import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { WorkflowDetailComponent } from './workflow-detail.component';

describe('Workflow Management Detail Component', () => {
  let comp: WorkflowDetailComponent;
  let fixture: ComponentFixture<WorkflowDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ workflow: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(WorkflowDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(WorkflowDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load workflow on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.workflow).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
