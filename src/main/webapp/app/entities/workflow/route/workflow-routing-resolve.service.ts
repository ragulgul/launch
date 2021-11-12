import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWorkflow, Workflow } from '../workflow.model';
import { WorkflowService } from '../service/workflow.service';

@Injectable({ providedIn: 'root' })
export class WorkflowRoutingResolveService implements Resolve<IWorkflow> {
  constructor(protected service: WorkflowService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWorkflow> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((workflow: HttpResponse<Workflow>) => {
          if (workflow.body) {
            return of(workflow.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Workflow());
  }
}
