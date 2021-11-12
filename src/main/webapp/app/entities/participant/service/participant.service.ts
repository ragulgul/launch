import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParticipant, getParticipantIdentifier } from '../participant.model';

export type EntityResponseType = HttpResponse<IParticipant>;
export type EntityArrayResponseType = HttpResponse<IParticipant[]>;

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/participants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(participant: IParticipant): Observable<EntityResponseType> {
    return this.http.post<IParticipant>(this.resourceUrl, participant, { observe: 'response' });
  }

  update(participant: IParticipant): Observable<EntityResponseType> {
    return this.http.put<IParticipant>(`${this.resourceUrl}/${getParticipantIdentifier(participant) as number}`, participant, {
      observe: 'response',
    });
  }

  partialUpdate(participant: IParticipant): Observable<EntityResponseType> {
    return this.http.patch<IParticipant>(`${this.resourceUrl}/${getParticipantIdentifier(participant) as number}`, participant, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IParticipant>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IParticipant[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addParticipantToCollectionIfMissing(
    participantCollection: IParticipant[],
    ...participantsToCheck: (IParticipant | null | undefined)[]
  ): IParticipant[] {
    const participants: IParticipant[] = participantsToCheck.filter(isPresent);
    if (participants.length > 0) {
      const participantCollectionIdentifiers = participantCollection.map(participantItem => getParticipantIdentifier(participantItem)!);
      const participantsToAdd = participants.filter(participantItem => {
        const participantIdentifier = getParticipantIdentifier(participantItem);
        if (participantIdentifier == null || participantCollectionIdentifiers.includes(participantIdentifier)) {
          return false;
        }
        participantCollectionIdentifiers.push(participantIdentifier);
        return true;
      });
      return [...participantsToAdd, ...participantCollection];
    }
    return participantCollection;
  }
}
