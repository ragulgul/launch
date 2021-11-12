import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWorkflow, getWorkflowIdentifier } from '../workflow.model';

export type EntityResponseType = HttpResponse<IWorkflow>;
export type EntityArrayResponseType = HttpResponse<IWorkflow[]>;

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/workflows');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(workflow: IWorkflow): Observable<EntityResponseType> {
    return this.http.post<IWorkflow>(this.resourceUrl, workflow, { observe: 'response' });
  }

  update(workflow: IWorkflow): Observable<EntityResponseType> {
    return this.http.put<IWorkflow>(`${this.resourceUrl}/${getWorkflowIdentifier(workflow) as number}`, workflow, { observe: 'response' });
  }

  partialUpdate(workflow: IWorkflow): Observable<EntityResponseType> {
    return this.http.patch<IWorkflow>(`${this.resourceUrl}/${getWorkflowIdentifier(workflow) as number}`, workflow, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IWorkflow>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWorkflow[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addWorkflowToCollectionIfMissing(workflowCollection: IWorkflow[], ...workflowsToCheck: (IWorkflow | null | undefined)[]): IWorkflow[] {
    const workflows: IWorkflow[] = workflowsToCheck.filter(isPresent);
    if (workflows.length > 0) {
      const workflowCollectionIdentifiers = workflowCollection.map(workflowItem => getWorkflowIdentifier(workflowItem)!);
      const workflowsToAdd = workflows.filter(workflowItem => {
        const workflowIdentifier = getWorkflowIdentifier(workflowItem);
        if (workflowIdentifier == null || workflowCollectionIdentifiers.includes(workflowIdentifier)) {
          return false;
        }
        workflowCollectionIdentifiers.push(workflowIdentifier);
        return true;
      });
      return [...workflowsToAdd, ...workflowCollection];
    }
    return workflowCollection;
  }
}
