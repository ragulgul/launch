import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IParticipant, Participant } from '../participant.model';
import { ParticipantService } from '../service/participant.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';

@Component({
  selector: 'jhi-participant-update',
  templateUrl: './participant-update.component.html',
})
export class ParticipantUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  teamsSharedCollection: ITeam[] = [];

  editForm = this.fb.group({
    id: [],
    firstName: [],
    lastName: [],
    displayName: [],
    user: [],
    team: [],
  });

  constructor(
    protected participantService: ParticipantService,
    protected userService: UserService,
    protected teamService: TeamService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ participant }) => {
      this.updateForm(participant);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const participant = this.createFromForm();
    if (participant.id !== undefined) {
      this.subscribeToSaveResponse(this.participantService.update(participant));
    } else {
      this.subscribeToSaveResponse(this.participantService.create(participant));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackTeamById(index: number, item: ITeam): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParticipant>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(participant: IParticipant): void {
    this.editForm.patchValue({
      id: participant.id,
      firstName: participant.firstName,
      lastName: participant.lastName,
      displayName: participant.displayName,
      user: participant.user,
      team: participant.team,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, participant.user);
    this.teamsSharedCollection = this.teamService.addTeamToCollectionIfMissing(this.teamsSharedCollection, participant.team);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.teamService
      .query()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.teamService.addTeamToCollectionIfMissing(teams, this.editForm.get('team')!.value)))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));
  }

  protected createFromForm(): IParticipant {
    return {
      ...new Participant(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      displayName: this.editForm.get(['displayName'])!.value,
      user: this.editForm.get(['user'])!.value,
      team: this.editForm.get(['team'])!.value,
    };
  }
}
