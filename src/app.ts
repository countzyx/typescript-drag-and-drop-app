class ProjectInput {
  private _templateElement: HTMLTemplateElement;
  private _hostElement: HTMLDivElement;

  constructor() {
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
      throw Error('No form element inside template.');
    }
    this.configureForm(formElement);
    this.attach(formElement);
  }

  private attach(formElement: HTMLFormElement) {
    this._hostElement.insertAdjacentElement('afterbegin', formElement);
  }

  private configureForm(formElement: HTMLFormElement) {
    formElement.id = 'user-input';
    formElement.addEventListener('submit', this.submitHandler.bind(this));
  }

  private submitHandler(event: Event) {
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;
    const titleInputElement = formElement.querySelector('#title') as HTMLInputElement;
    console.log(titleInputElement.value);
  }
}

const projectInput = new ProjectInput();