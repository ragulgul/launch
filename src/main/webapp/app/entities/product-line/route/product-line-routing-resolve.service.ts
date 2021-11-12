import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductLine, ProductLine } from '../product-line.model';
import { ProductLineService } from '../service/product-line.service';

@Injectable({ providedIn: 'root' })
export class ProductLineRoutingResolveService implements Resolve<IProductLine> {
  constructor(protected service: ProductLineService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductLine> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productLine: HttpResponse<ProductLine>) => {
          if (productLine.body) {
            return of(productLine.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProductLine());
  }
}
