import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILaunch } from '../launch.model';
import { LaunchService } from '../service/launch.service';
import { LaunchDeleteDialogComponent } from '../delete/launch-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-launch',
  templateUrl: './launch.component.html',
})
export class LaunchComponent implements OnInit {
  launches?: ILaunch[];
  isLoading = false;

  constructor(protected launchService: LaunchService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.launchService.query().subscribe(
      (res: HttpResponse<ILaunch[]>) => {
        this.isLoading = false;
        this.launches = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILaunch): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(launch: ILaunch): void {
    const modalRef = this.modalService.open(LaunchDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.launch = launch;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
