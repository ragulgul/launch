import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductLine } from '../product-line.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-product-line-detail',
  templateUrl: './product-line-detail.component.html',
})
export class ProductLineDetailComponent implements OnInit {
  productLine: IProductLine | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productLine }) => {
      this.productLine = productLine;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
