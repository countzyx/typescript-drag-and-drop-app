export type ProjectStatus = 'active' | 'finished';
export const kActive: ProjectStatus = 'active';
export const kFinished: ProjectStatus = 'finished';

export class ProjectInfo {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public peopleCount: number,
    public status: ProjectStatus
  ) {}
}
