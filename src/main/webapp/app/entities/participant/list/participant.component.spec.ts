import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ParticipantService } from '../service/participant.service';

import { ParticipantComponent } from './participant.component';

describe('Participant Management Component', () => {
  let comp: ParticipantComponent;
  let fixture: ComponentFixture<ParticipantComponent>;
  let service: ParticipantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ParticipantComponent],
    })
      .overrideTemplate(ParticipantComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParticipantComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ParticipantService);

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
    expect(comp.participants?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
