import { IProductLine } from 'app/entities/product-line/product-line.model';

export interface IProduct {
  id?: number;
  name?: string;
  description?: string | null;
  iconContentType?: string | null;
  icon?: string | null;
  line?: IProductLine;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string | null,
    public iconContentType?: string | null,
    public icon?: string | null,
    public line?: IProductLine
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
