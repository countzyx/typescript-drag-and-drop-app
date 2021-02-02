interface ProjectInfo {
  id: number;
  title: string;
  description: string;
  peopleCount: number;
}

// Validatable is an inteface to describe validation requirements for input values.
interface Validatable {
  value?: string | number;
  name: string;
  isRequired?: boolean;
  minSize?: number;
  maxSize?: number;
}

interface ValidityStatus {
  isValid: boolean;
  message: string;
}

// Autobind is a decorator to assign the proper "this" to class methods that are event handlers, etc.
function Autobind() {
  return function (_0: unknown, _1: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      get() {
        return originalMethod.bind(this);
      },
    };
    return adjDescriptor;
  };
}

// ProjectInput
class ProjectInput {
  private _templateElement: HTMLTemplateElement;
  private _hostElement: HTMLDivElement;

  constructor(private _projectState: ProjectState) {
    this._templateElement = document.getElementById('project-input') as HTMLTemplateElement;
    if (!this._templateElement) {
      throw Error('No "project-input" element defined on the page.');
    }

    this._hostElement = document.getElementById('app') as HTMLDivElement;
    if (!this._hostElement) {
      throw Error('No "app" element defined on the page.');
    }

    const importedNode = document.importNode(this._templateElement.content, true);
    const formElement = importedNode.firstElementChild as HTMLFormElement;
    if (!formElement) {
      throw Error('No form element inside the project input template.');
    }
    this.configureForm(formElement);
    this._hostElement.insertAdjacentElement('afterbegin', formElement);
  }

  private clearInputs(formElement: HTMLFormElement) {
    formElement.reset();
  }

  private configureForm(formElement: HTMLFormElement) {
    formElement.id = 'user-input';
    formElement.addEventListener('submit', this.submitHandler);
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

    const titleValidity = ProjectInput.validate({ value: title, name: 'Title', isRequired: true, minSize: 1 });
    const descriptionValidity = ProjectInput.validate({
      value: description,
      name: 'Description',
      isRequired: true,
      minSize: 5,
    });
    const peopleCountValidity = ProjectInput.validate({
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
    console.log(userInput);
    if (Array.isArray(userInput)) {
      const [title, description, peopleCount] = userInput;
      this._projectState.addProject(title || 'undefined', description || 'undefined', peopleCount || 0);
      this.clearInputs(formElement);
    } else {
      alert(userInput.message);
    }
  }

  private static validate(validatableInput: Validatable): ValidityStatus {
    const status: ValidityStatus = { isValid: true, message: '' };
    const { value, name, isRequired, minSize, maxSize } = validatableInput;
    const trimmedValue = value ? value.toString().trim() : '';
    const hasValue = trimmedValue.length !== 0 || typeof value === 'number';
    if (isRequired) {
      status.isValid &&= hasValue;
      if (!hasValue) {
        status.message += name + ' is required. Please provide a value.\n';
      }
    }

    if (hasValue) {
      switch (typeof value) {
        case 'number': {
          if (minSize != null) {
            const isLessThanMin = value < minSize;
            status.isValid &&= !isLessThanMin;
            if (isLessThanMin) {
              status.message += name + ' must be greater than ' + minSize + '.\n';
            }
          }

          if (maxSize != null) {
            const isGreaterThanMax = value > maxSize;
            status.isValid &&= !isGreaterThanMax;
            if (isGreaterThanMax) {
              status.message += name + ' must be less than ' + maxSize + '.\n';
            }
          }

          break;
        }
        case 'string': {
          if (minSize != null) {
            const isLessThanMin = trimmedValue.length < minSize;
            status.isValid &&= !isLessThanMin;
            if (isLessThanMin) {
              status.message += name + ' must have a length greater than ' + minSize + '.\n';
            }
          }

          if (maxSize != null) {
            const isGreaterThanMax = trimmedValue.length > maxSize;
            status.isValid &&= !isGreaterThanMax;
            if (isGreaterThanMax) {
              status.message += name + ' must have a length less than ' + maxSize + '.\n';
            }
          }
          break;
        }
        default: {
          break;
        }
      }
    }

    return status;
  }
}

// ProjectList
class ProjectList {
  private _templateElement: HTMLTemplateElement;
  private _sectionElement: HTMLElement;
  private _listId: string;

  constructor(private _listType: 'active' | 'finished', private _projectState: ProjectState) {
    this._listId = `${this._listType}-projects-list`;
    this._templateElement = document.getElementById('project-list') as HTMLTemplateElement;
    if (!this._templateElement) {
      throw Error('No "project-list" element defined on the page.');
    }

    const hostElement = document.getElementById('app') as HTMLDivElement;
    if (!hostElement) {
      throw Error('No "app" element defined on the page.');
    }

    const importedNode = document.importNode(this._templateElement.content, true);
    this._sectionElement = importedNode.firstElementChild as HTMLElement;
    if (!this._sectionElement) {
      throw Error('No section element inside the project list template.');
    }
    this._sectionElement.id = `${_listType}-projects`;
    hostElement.insertAdjacentElement('beforeend', this._sectionElement);

    this._projectState.addListener((projects: ProjectInfo[]) => {
      this.renderProjects(projects);
    });

    this.renderContent(this._sectionElement);
  }

  private renderContent(sectionElement: HTMLElement) {
    const sectionList = sectionElement.querySelector('ul') as HTMLUListElement;
    if (!sectionList) {
      throw Error('Cannot find UL inside the section element');
    }

    sectionList.id = this._listId;

    const sectionHeadline = sectionElement.querySelector('h2') as HTMLElement;
    if (!sectionHeadline) {
      throw Error('Cannot find H2 inside the section element');
    }
    sectionHeadline.textContent = this._listType.toUpperCase() + ' PROJECTS';
  }

  private renderProjects(projects: ProjectInfo[]) {
    if (!projects.length) {
      return;
    }

    const listElement = this._sectionElement.querySelector('#' + this._listId) as HTMLUListElement;
    if (!listElement) {
      throw Error(`Cannot find ${this._listId} list`);
    }
    while (listElement.lastChild) {
      listElement.removeChild(listElement.lastChild);
    }
    for (const project of projects) {
      const listItem = document.createElement('li');
      listItem.textContent = project.title;
      listElement.appendChild(listItem);
    }
  }
}

// ProjectState is the controller for this page.
class ProjectState {
  private static _instance: ProjectState;
  private _lastId = 0;
  private _listeners: Array<(projects: ProjectInfo[]) => void> = [];
  private _projects: ProjectInfo[] = [];

  private constructor() {}

  static getInstance() {
    if (!this._instance) {
      this._instance = new ProjectState();
    }

    return this._instance;
  }

  addListener(listener: (projects: ProjectInfo[]) => void) {
    this._listeners.push(listener);
  }

  addProject(title: string, description: string, peopleCount: number) {
    this._lastId++;
    const newProject: ProjectInfo = {
      id: this._lastId,
      title: title,
      description: description,
      peopleCount: peopleCount,
    };
    this._projects.push(newProject);
    for (const listener of this._listeners) {
      listener(this._projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const projectInput = new ProjectInput(projectState);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const activeProjectList = new ProjectList('active', projectState);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const finishedProjectList = new ProjectList('finished', projectState);
