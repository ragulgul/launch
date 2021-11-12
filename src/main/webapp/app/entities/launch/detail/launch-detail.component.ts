import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILaunch } from '../launch.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-launch-detail',
  templateUrl: './launch-detail.component.html',
})
export class LaunchDetailComponent implements OnInit {
  launch: ILaunch | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ launch }) => {
      this.launch = launch;
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
