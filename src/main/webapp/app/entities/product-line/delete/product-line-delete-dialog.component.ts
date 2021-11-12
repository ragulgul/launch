import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductLine } from '../product-line.model';
import { ProductLineService } from '../service/product-line.service';

@Component({
  templateUrl: './product-line-delete-dialog.component.html',
})
export class ProductLineDeleteDialogComponent {
  productLine?: IProductLine;

  constructor(protected productLineService: ProductLineService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productLineService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
