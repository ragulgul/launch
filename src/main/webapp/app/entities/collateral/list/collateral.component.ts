import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICollateral } from '../collateral.model';
import { CollateralService } from '../service/collateral.service';
import { CollateralDeleteDialogComponent } from '../delete/collateral-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-collateral',
  templateUrl: './collateral.component.html',
})
export class CollateralComponent implements OnInit {
  collaterals?: ICollateral[];
  isLoading = false;

  constructor(protected collateralService: CollateralService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.collateralService.query().subscribe(
      (res: HttpResponse<ICollateral[]>) => {
        this.isLoading = false;
        this.collaterals = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICollateral): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(collateral: ICollateral): void {
    const modalRef = this.modalService.open(CollateralDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.collateral = collateral;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
