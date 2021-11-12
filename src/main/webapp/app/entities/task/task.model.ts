import { ITeam } from 'app/entities/team/team.model';
import { IWorkflow } from 'app/entities/workflow/workflow.model';

export interface ITask {
  id?: number;
  name?: string;
  description?: string | null;
  assignedTo?: ITeam | null;
  workflow?: IWorkflow;
}

export class Task implements ITask {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string | null,
    public assignedTo?: ITeam | null,
    public workflow?: IWorkflow
  ) {}
}

export function getTaskIdentifier(task: ITask): number | undefined {
  return task.id;
}
