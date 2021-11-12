import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProductLineService } from '../service/product-line.service';

import { ProductLineComponent } from './product-line.component';

describe('ProductLine Management Component', () => {
  let comp: ProductLineComponent;
  let fixture: ComponentFixture<ProductLineComponent>;
  let service: ProductLineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProductLineComponent],
    })
      .overrideTemplate(ProductLineComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductLineComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProductLineService);

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
    expect(comp.productLines?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
