import { IWorkflow } from 'app/entities/workflow/workflow.model';
import { ILaunch } from 'app/entities/launch/launch.model';

export interface ICollateral {
  id?: number;
  name?: string;
  description?: string | null;
  iconContentType?: string | null;
  icon?: string | null;
  contentContentType?: string | null;
  content?: string | null;
  version?: number | null;
  workflow?: IWorkflow | null;
  launch?: ILaunch;
}

export class Collateral implements ICollateral {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string | null,
    public iconContentType?: string | null,
    public icon?: string | null,
    public contentContentType?: string | null,
    public content?: string | null,
    public version?: number | null,
    public workflow?: IWorkflow | null,
    public launch?: ILaunch
  ) {}
}

export function getCollateralIdentifier(collateral: ICollateral): number | undefined {
  return collateral.id;
}
