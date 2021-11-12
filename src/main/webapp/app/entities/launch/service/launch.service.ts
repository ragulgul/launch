import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILaunch, getLaunchIdentifier } from '../launch.model';

export type EntityResponseType = HttpResponse<ILaunch>;
export type EntityArrayResponseType = HttpResponse<ILaunch[]>;

@Injectable({ providedIn: 'root' })
export class LaunchService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/launches');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(launch: ILaunch): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(launch);
    return this.http
      .post<ILaunch>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(launch: ILaunch): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(launch);
    return this.http
      .put<ILaunch>(`${this.resourceUrl}/${getLaunchIdentifier(launch) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(launch: ILaunch): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(launch);
    return this.http
      .patch<ILaunch>(`${this.resourceUrl}/${getLaunchIdentifier(launch) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILaunch>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILaunch[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLaunchToCollectionIfMissing(launchCollection: ILaunch[], ...launchesToCheck: (ILaunch | null | undefined)[]): ILaunch[] {
    const launches: ILaunch[] = launchesToCheck.filter(isPresent);
    if (launches.length > 0) {
      const launchCollectionIdentifiers = launchCollection.map(launchItem => getLaunchIdentifier(launchItem)!);
      const launchesToAdd = launches.filter(launchItem => {
        const launchIdentifier = getLaunchIdentifier(launchItem);
        if (launchIdentifier == null || launchCollectionIdentifiers.includes(launchIdentifier)) {
          return false;
        }
        launchCollectionIdentifiers.push(launchIdentifier);
        return true;
      });
      return [...launchesToAdd, ...launchCollection];
    }
    return launchCollection;
  }

  protected convertDateFromClient(launch: ILaunch): ILaunch {
    return Object.assign({}, launch, {
      start: launch.start?.isValid() ? launch.start.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.start = res.body.start ? dayjs(res.body.start) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((launch: ILaunch) => {
        launch.start = launch.start ? dayjs(launch.start) : undefined;
      });
    }
    return res;
  }
}
