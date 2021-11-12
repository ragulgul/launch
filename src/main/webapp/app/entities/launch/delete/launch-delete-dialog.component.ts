import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILaunch } from '../launch.model';
import { LaunchService } from '../service/launch.service';

@Component({
  templateUrl: './launch-delete-dialog.component.html',
})
export class LaunchDeleteDialogComponent {
  launch?: ILaunch;

  constructor(protected launchService: LaunchService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.launchService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
