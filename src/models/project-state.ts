/// <reference path="project.ts" />

namespace App {
  export type Listener<T> = (projects: T[]) => void;

  class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listener: Listener<T>) {
      this.listeners.push(listener);
    }
  }

  // ProjectState
  export class ProjectState extends State<ProjectInfo> {
    private static _instance: ProjectState;
    private _lastId = 0;
    private _projects: ProjectInfo[] = [];

    private constructor() {
      super();
    }

    static getInstance() {
      if (!this._instance) {
        this._instance = new ProjectState();
      }

      return this._instance;
    }

    addProject(title: string, description: string, peopleCount: number) {
      this._lastId++;
      const newProject: ProjectInfo = {
        id: this._lastId,
        title: title,
        description: description,
        peopleCount: peopleCount,
        status: kActive,
      };
      this._projects.push(newProject);

      this.updateListeners();
    }

    moveProject(projectId: number, newStatus: ProjectStatus) {
      const project = this._projects.find((p) => p.id === projectId);
      if (project && project.status !== newStatus) {
        project.status = newStatus;
        this.updateListeners();
      }
    }

    updateListeners() {
      for (const listener of this.listeners) {
        listener(this._projects.slice());
      }
    }
  }

  export const projectState = ProjectState.getInstance();
}
