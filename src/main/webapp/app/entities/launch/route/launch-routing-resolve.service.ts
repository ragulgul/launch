import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILaunch, Launch } from '../launch.model';
import { LaunchService } from '../service/launch.service';

@Injectable({ providedIn: 'root' })
export class LaunchRoutingResolveService implements Resolve<ILaunch> {
  constructor(protected service: LaunchService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILaunch> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((launch: HttpResponse<Launch>) => {
          if (launch.body) {
            return of(launch.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Launch());
  }
}
