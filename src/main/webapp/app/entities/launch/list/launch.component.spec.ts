import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LaunchService } from '../service/launch.service';

import { LaunchComponent } from './launch.component';

describe('Launch Management Component', () => {
  let comp: LaunchComponent;
  let fixture: ComponentFixture<LaunchComponent>;
  let service: LaunchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LaunchComponent],
    })
      .overrideTemplate(LaunchComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LaunchComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LaunchService);

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
    expect(comp.launches?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
