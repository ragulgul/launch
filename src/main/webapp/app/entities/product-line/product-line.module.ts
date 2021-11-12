import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProductLineComponent } from './list/product-line.component';
import { ProductLineDetailComponent } from './detail/product-line-detail.component';
import { ProductLineUpdateComponent } from './update/product-line-update.component';
import { ProductLineDeleteDialogComponent } from './delete/product-line-delete-dialog.component';
import { ProductLineRoutingModule } from './route/product-line-routing.module';

@NgModule({
  imports: [SharedModule, ProductLineRoutingModule],
  declarations: [ProductLineComponent, ProductLineDetailComponent, ProductLineUpdateComponent, ProductLineDeleteDialogComponent],
  entryComponents: [ProductLineDeleteDialogComponent],
})
export class ProductLineModule {}
