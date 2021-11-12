import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICollateral } from '../collateral.model';
import { CollateralService } from '../service/collateral.service';

@Component({
  templateUrl: './collateral-delete-dialog.component.html',
})
export class CollateralDeleteDialogComponent {
  collateral?: ICollateral;

  constructor(protected collateralService: CollateralService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.collateralService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
