import { IParticipant } from 'app/entities/participant/participant.model';

export interface ITeam {
  id?: number;
  name?: string;
  description?: string | null;
  members?: IParticipant[] | null;
}

export class Team implements ITeam {
  constructor(public id?: number, public name?: string, public description?: string | null, public members?: IParticipant[] | null) {}
}

export function getTeamIdentifier(team: ITeam): number | undefined {
  return team.id;
}
