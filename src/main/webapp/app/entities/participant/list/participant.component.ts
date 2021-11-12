import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IParticipant } from '../participant.model';
import { ParticipantService } from '../service/participant.service';
import { ParticipantDeleteDialogComponent } from '../delete/participant-delete-dialog.component';

@Component({
  selector: 'jhi-participant',
  templateUrl: './participant.component.html',
})
export class ParticipantComponent implements OnInit {
  participants?: IParticipant[];
  isLoading = false;

  constructor(protected participantService: ParticipantService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.participantService.query().subscribe(
      (res: HttpResponse<IParticipant[]>) => {
        this.isLoading = false;
        this.participants = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IParticipant): number {
    return item.id!;
  }

  delete(participant: IParticipant): void {
    const modalRef = this.modalService.open(ParticipantDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.participant = participant;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
