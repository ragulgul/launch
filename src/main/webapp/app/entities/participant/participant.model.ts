import { IUser } from 'app/entities/user/user.model';
import { ITeam } from 'app/entities/team/team.model';

export interface IParticipant {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  user?: IUser | null;
  team?: ITeam | null;
}

export class Participant implements IParticipant {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public lastName?: string | null,
    public displayName?: string | null,
    public user?: IUser | null,
    public team?: ITeam | null
  ) {}
}

export function getParticipantIdentifier(participant: IParticipant): number | undefined {
  return participant.id;
}
