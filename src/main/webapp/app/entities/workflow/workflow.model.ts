import { ITask } from 'app/entities/task/task.model';

export interface IWorkflow {
  id?: number;
  name?: string;
  description?: string | null;
  tasks?: ITask[] | null;
}

export class Workflow implements IWorkflow {
  constructor(public id?: number, public name?: string, public description?: string | null, public tasks?: ITask[] | null) {}
}

export function getWorkflowIdentifier(workflow: IWorkflow): number | undefined {
  return workflow.id;
}
