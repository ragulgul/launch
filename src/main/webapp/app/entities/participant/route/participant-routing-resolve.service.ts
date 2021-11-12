import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParticipant, Participant } from '../participant.model';
import { ParticipantService } from '../service/participant.service';

@Injectable({ providedIn: 'root' })
export class ParticipantRoutingResolveService implements Resolve<IParticipant> {
  constructor(protected service: ParticipantService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParticipant> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((participant: HttpResponse<Participant>) => {
          if (participant.body) {
            return of(participant.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Participant());
  }
}
