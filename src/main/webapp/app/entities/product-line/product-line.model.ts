import { IProduct } from 'app/entities/product/product.model';

export interface IProductLine {
  id?: number;
  name?: string;
  description?: string | null;
  iconContentType?: string | null;
  icon?: string | null;
  products?: IProduct[] | null;
}

export class ProductLine implements IProductLine {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string | null,
    public iconContentType?: string | null,
    public icon?: string | null,
    public products?: IProduct[] | null
  ) {}
}

export function getProductLineIdentifier(productLine: IProductLine): number | undefined {
  return productLine.id;
}
