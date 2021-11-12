import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CollateralComponent } from './list/collateral.component';
import { CollateralDetailComponent } from './detail/collateral-detail.component';
import { CollateralUpdateComponent } from './update/collateral-update.component';
import { CollateralDeleteDialogComponent } from './delete/collateral-delete-dialog.component';
import { CollateralRoutingModule } from './route/collateral-routing.module';

@NgModule({
  imports: [SharedModule, CollateralRoutingModule],
  declarations: [CollateralComponent, CollateralDetailComponent, CollateralUpdateComponent, CollateralDeleteDialogComponent],
  entryComponents: [CollateralDeleteDialogComponent],
})
export class CollateralModule {}
