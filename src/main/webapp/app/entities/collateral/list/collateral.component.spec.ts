import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CollateralService } from '../service/collateral.service';

import { CollateralComponent } from './collateral.component';

describe('Collateral Management Component', () => {
  let comp: CollateralComponent;
  let fixture: ComponentFixture<CollateralComponent>;
  let service: CollateralService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CollateralComponent],
    })
      .overrideTemplate(CollateralComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CollateralComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CollateralService);

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
    expect(comp.collaterals?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
