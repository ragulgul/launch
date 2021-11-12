import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductLine, getProductLineIdentifier } from '../product-line.model';

export type EntityResponseType = HttpResponse<IProductLine>;
export type EntityArrayResponseType = HttpResponse<IProductLine[]>;

@Injectable({ providedIn: 'root' })
export class ProductLineService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-lines');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(productLine: IProductLine): Observable<EntityResponseType> {
    return this.http.post<IProductLine>(this.resourceUrl, productLine, { observe: 'response' });
  }

  update(productLine: IProductLine): Observable<EntityResponseType> {
    return this.http.put<IProductLine>(`${this.resourceUrl}/${getProductLineIdentifier(productLine) as number}`, productLine, {
      observe: 'response',
    });
  }

  partialUpdate(productLine: IProductLine): Observable<EntityResponseType> {
    return this.http.patch<IProductLine>(`${this.resourceUrl}/${getProductLineIdentifier(productLine) as number}`, productLine, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProductLine>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProductLine[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProductLineToCollectionIfMissing(
    productLineCollection: IProductLine[],
    ...productLinesToCheck: (IProductLine | null | undefined)[]
  ): IProductLine[] {
    const productLines: IProductLine[] = productLinesToCheck.filter(isPresent);
    if (productLines.length > 0) {
      const productLineCollectionIdentifiers = productLineCollection.map(productLineItem => getProductLineIdentifier(productLineItem)!);
      const productLinesToAdd = productLines.filter(productLineItem => {
        const productLineIdentifier = getProductLineIdentifier(productLineItem);
        if (productLineIdentifier == null || productLineCollectionIdentifiers.includes(productLineIdentifier)) {
          return false;
        }
        productLineCollectionIdentifiers.push(productLineIdentifier);
        return true;
      });
      return [...productLinesToAdd, ...productLineCollection];
    }
    return productLineCollection;
  }
}
