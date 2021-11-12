import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICollateral, Collateral } from '../collateral.model';
import { CollateralService } from '../service/collateral.service';

@Injectable({ providedIn: 'root' })
export class CollateralRoutingResolveService implements Resolve<ICollateral> {
  constructor(protected service: CollateralService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICollateral> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((collateral: HttpResponse<Collateral>) => {
          if (collateral.body) {
            return of(collateral.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Collateral());
  }
}
