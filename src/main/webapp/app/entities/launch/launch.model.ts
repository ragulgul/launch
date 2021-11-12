import * as dayjs from 'dayjs';
import { IWorkflow } from 'app/entities/workflow/workflow.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { IProduct } from 'app/entities/product/product.model';

export interface ILaunch {
  id?: number;
  name?: string;
  description?: string | null;
  start?: dayjs.Dayjs | null;
  version?: number | null;
  iconContentType?: string | null;
  icon?: string | null;
  workflow?: IWorkflow | null;
  collaterals?: ICollateral[] | null;
  product?: IProduct;
}

export class Launch implements ILaunch {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string | null,
    public start?: dayjs.Dayjs | null,
    public version?: number | null,
    public iconContentType?: string | null,
    public icon?: string | null,
    public workflow?: IWorkflow | null,
    public collaterals?: ICollateral[] | null,
    public product?: IProduct
  ) {}
}

export function getLaunchIdentifier(launch: ILaunch): number | undefined {
  return launch.id;
}
