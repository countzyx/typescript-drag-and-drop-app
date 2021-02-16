import { Component } from './base-component';
import { ProjectState } from '../models/project-state';
import { validate, ValidityStatus } from '../utility/validation';
import { Autobind } from '../utility/decorators/autobind';

// ProjectInput
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  constructor(private _projectState: ProjectState) {
    super('project-input', 'app');
    this.configureForm();
    this.renderContent();
  }

  protected renderContent() {
    this.hostElement.insertAdjacentElement('afterbegin', this.componentElement);
  }

  private configureForm() {
    this.componentElement.id = 'user-input';
    this.componentElement.addEventListener('submit', this.submitHandler);
  }

  private gatherUserInput(formElement: HTMLFormElement): [string?, string?, number?] | ValidityStatus {
    let title: string | undefined;
    let description: string | undefined;
    let peopleCount: number | undefined;

    const titleInputElement = formElement.querySelector('#title') as HTMLInputElement;
    if (titleInputElement) {
      title = titleInputElement.value;
    }
    const descriptionInputElement = formElement.querySelector('#description') as HTMLInputElement;
    if (descriptionInputElement) {
      description = descriptionInputElement.value;
    }
    const peopleInputElement = formElement.querySelector('#people') as HTMLInputElement;
    if (peopleInputElement) {
      peopleCount = +peopleInputElement.value;
    }

    const titleValidity = validate({ value: title, name: 'Title', isRequired: true, minSize: 1 });
    const descriptionValidity = validate({
      value: description,
      name: 'Description',
      isRequired: true,
      minSize: 5,
    });
    const peopleCountValidity = validate({
      value: peopleCount,
      name: 'People',
      isRequired: true,
      minSize: 1,
      maxSize: 5,
    });

    const isValid = titleValidity.isValid && descriptionValidity.isValid && peopleCountValidity.isValid;
    if (isValid) {
      return [title, description, peopleCount];
    } else {
      const message = titleValidity.message + descriptionValidity.message + peopleCountValidity.message;
      return { isValid, message };
    }
  }

  @Autobind()
  private submitHandler(event: Event) {
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;
    const userInput = this.gatherUserInput(formElement);
    if (Array.isArray(userInput)) {
      const [title, description, peopleCount] = userInput;
      this._projectState.addProject(title || 'undefined', description || 'undefined', peopleCount || 0);
      this.componentElement.reset();
    } else {
      alert(userInput.message);
    }
  }
}
