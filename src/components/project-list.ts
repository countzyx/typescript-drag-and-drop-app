/// <reference path="base-component.ts" />
/// <reference path="project-item.ts" />
/// <reference path="../models/drag-drop.ts" />
/// <reference path="../models/project.ts" />
/// <reference path="../models/project-state.ts" />
/// <reference path="../utility/decorators/autobind.ts" />

namespace App {
  // ProjectList
  export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DropOnable {
    private _listId: string;

    constructor(private _listType: ProjectStatus, private _projectState: ProjectState) {
      super('project-list', 'app');
      this._listId = `${this._listType}-projects-list`;
      this.componentElement.id = `${_listType}-projects`;

      this.renderContent();
    }

    @Autobind()
    dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] === kDataTextFormat) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        const listElement = this.componentElement.querySelector(`#${this._listId}`) as HTMLUListElement;
        if (!listElement) {
          console.error(`List ${this._listId} not found!`);
          return;
        }
        listElement.classList.add('droppable');
      }
    }

    @Autobind()
    dragLeaveHandler(_: DragEvent) {
      const listElement = this.componentElement.querySelector(`#${this._listId}`) as HTMLUListElement;
      if (!listElement) {
        console.error(`List ${this._listId} not found!`);
        return;
      }
      listElement.classList.remove('droppable');
    }

    @Autobind()
    dropHandler(event: DragEvent) {
      event.preventDefault();
      if (event.dataTransfer) {
        const projectId = +event.dataTransfer.getData(kDataTextFormat);
        this._projectState.moveProject(projectId, this._listType);
      } else {
        console.error('No dataTransfer', event);
      }
    }

    protected renderContent() {
      this.hostElement.insertAdjacentElement('beforeend', this.componentElement);

      this._projectState.addListener((projects: ProjectInfo[]) => {
        const filteredProjects = projects.filter((p) => {
          return p.status === this._listType;
        });
        this.renderProjects(filteredProjects);
      });

      const sectionList = this.componentElement.querySelector('ul') as HTMLUListElement;
      if (!sectionList) {
        throw Error('Cannot find UL inside the section element');
      }

      sectionList.id = this._listId;
      sectionList.addEventListener('dragover', this.dragOverHandler);
      sectionList.addEventListener('dragleave', this.dragLeaveHandler);
      sectionList.addEventListener('drop', this.dropHandler);

      const sectionHeadline = this.componentElement.querySelector('h2') as HTMLElement;
      if (!sectionHeadline) {
        throw Error('Cannot find H2 inside the section element');
      }
      sectionHeadline.textContent = this._listType.toUpperCase() + ' PROJECTS';
    }

    private renderProjects(projects: ProjectInfo[]) {
      const listElement = this.componentElement.querySelector('#' + this._listId) as HTMLUListElement;
      if (!listElement) {
        throw Error(`Cannot find ${this._listId} list`);
      }

      while (listElement.lastChild) {
        listElement.removeChild(listElement.lastChild);
      }

      for (const project of projects) {
        new ProjectItem(this._listId, project);
      }
    }
  }
}
