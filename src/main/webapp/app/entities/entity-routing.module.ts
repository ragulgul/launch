import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'product-line',
        data: { pageTitle: 'launchApp.productLine.home.title' },
        loadChildren: () => import('./product-line/product-line.module').then(m => m.ProductLineModule),
      },
      {
        path: 'product',
        data: { pageTitle: 'launchApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'launch',
        data: { pageTitle: 'launchApp.launch.home.title' },
        loadChildren: () => import('./launch/launch.module').then(m => m.LaunchModule),
      },
      {
        path: 'collateral',
        data: { pageTitle: 'launchApp.collateral.home.title' },
        loadChildren: () => import('./collateral/collateral.module').then(m => m.CollateralModule),
      },
      {
        path: 'workflow',
        data: { pageTitle: 'launchApp.workflow.home.title' },
        loadChildren: () => import('./workflow/workflow.module').then(m => m.WorkflowModule),
      },
      {
        path: 'task',
        data: { pageTitle: 'launchApp.task.home.title' },
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
      },
      {
        path: 'team',
        data: { pageTitle: 'launchApp.team.home.title' },
        loadChildren: () => import('./team/team.module').then(m => m.TeamModule),
      },
      {
        path: 'participant',
        data: { pageTitle: 'launchApp.participant.home.title' },
        loadChildren: () => import('./participant/participant.module').then(m => m.ParticipantModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
