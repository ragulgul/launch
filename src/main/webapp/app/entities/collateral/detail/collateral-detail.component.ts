import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICollateral } from '../collateral.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-collateral-detail',
  templateUrl: './collateral-detail.component.html',
})
export class CollateralDetailComponent implements OnInit {
  collateral: ICollateral | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ collateral }) => {
      this.collateral = collateral;
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
