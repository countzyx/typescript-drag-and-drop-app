import { Component } from './base-component.js';
import { Draggable, kDataTextFormat } from '../models/drag-drop.js';
import { ProjectInfo } from '../models/project.js';
import { Autobind } from '../utility/decorators/autobind.js';

// ProjectItem
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  get peopleCountText() {
    return this._project.peopleCount === 1 ? '1 person assigned' : `${this._project.peopleCount} people assigned`;
  }

  constructor(hostId: string, private _project: ProjectInfo) {
    super('single-project', hostId);
    this.componentElement.id = this._project.id.toString();

    this.renderContent();
  }

  @Autobind()
  dragStartHandler(event: DragEvent) {
    if (event.dataTransfer) {
      event.dataTransfer.setData(kDataTextFormat, this._project.id.toString());
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  @Autobind()
  dragEndHandler(_: DragEvent) {}

  protected renderContent() {
    this.hostElement.insertAdjacentElement('beforeend', this.componentElement);
    const nameElement = this.componentElement.querySelector('h2');
    if (!nameElement) {
      throw Error(`Cannot find H2 inside the list element "${this._project.title}" (id: ${this._project.id})`);
    }

    const peopleCountElement = this.componentElement.querySelector('h3');
    if (!peopleCountElement) {
      throw Error(`Cannot find H3 inside the list element "${this._project.title}" (id: ${this._project.id})`);
    }

    const descriptionElement = this.componentElement.querySelector('p') as HTMLParagraphElement;
    if (!descriptionElement) {
      throw Error(`Cannot find P inside the list element "${this._project.title}" (id: ${this._project.id})`);
    }

    nameElement.textContent = this._project.title;
    peopleCountElement.textContent = this.peopleCountText;
    descriptionElement.textContent = this._project.description;

    this.componentElement.draggable = true;
    this.componentElement.addEventListener('dragstart', this.dragStartHandler);
    this.componentElement.addEventListener('dragend', this.dragEndHandler);
  }
}
