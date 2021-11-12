import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICollateral, getCollateralIdentifier } from '../collateral.model';

export type EntityResponseType = HttpResponse<ICollateral>;
export type EntityArrayResponseType = HttpResponse<ICollateral[]>;

@Injectable({ providedIn: 'root' })
export class CollateralService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/collaterals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(collateral: ICollateral): Observable<EntityResponseType> {
    return this.http.post<ICollateral>(this.resourceUrl, collateral, { observe: 'response' });
  }

  update(collateral: ICollateral): Observable<EntityResponseType> {
    return this.http.put<ICollateral>(`${this.resourceUrl}/${getCollateralIdentifier(collateral) as number}`, collateral, {
      observe: 'response',
    });
  }

  partialUpdate(collateral: ICollateral): Observable<EntityResponseType> {
    return this.http.patch<ICollateral>(`${this.resourceUrl}/${getCollateralIdentifier(collateral) as number}`, collateral, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICollateral>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICollateral[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCollateralToCollectionIfMissing(
    collateralCollection: ICollateral[],
    ...collateralsToCheck: (ICollateral | null | undefined)[]
  ): ICollateral[] {
    const collaterals: ICollateral[] = collateralsToCheck.filter(isPresent);
    if (collaterals.length > 0) {
      const collateralCollectionIdentifiers = collateralCollection.map(collateralItem => getCollateralIdentifier(collateralItem)!);
      const collateralsToAdd = collaterals.filter(collateralItem => {
        const collateralIdentifier = getCollateralIdentifier(collateralItem);
        if (collateralIdentifier == null || collateralCollectionIdentifiers.includes(collateralIdentifier)) {
          return false;
        }
        collateralCollectionIdentifiers.push(collateralIdentifier);
        return true;
      });
      return [...collateralsToAdd, ...collateralCollection];
    }
    return collateralCollection;
  }
}
