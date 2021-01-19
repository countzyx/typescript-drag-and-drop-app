class ProjectInput {
  private _templateElement: HTMLTemplateElement;
  private _hostElement: HTMLDivElement;
  private _formElement: HTMLFormElement;
  private _titleInputElement: HTMLInputElement;
//  private _descriptionInputElement: HTMLInputElement;
//  private _peopleInputElement: HTMLInputElement;

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
    this._formElement = importedNode.firstElementChild as HTMLFormElement;
    if (!this._formElement) {
      throw Error('No form element inside template.');
    }
    this._formElement.id = 'user-input';
    this._titleInputElement = this._formElement.querySelector('#title') as HTMLInputElement;
//    this._descriptionInputElement = this._formElement.querySelector('#description') as HTMLInputElement;
//    this._peopleInputElement = this._formElement.querySelector('#people') as HTMLInputElement;
    this.configureForm();
    this.attach();
  }

  private attach() {
    this._hostElement.insertAdjacentElement('afterbegin', this._formElement);
  }

  private configureForm() {
    this._formElement.addEventListener('submit', this.submitHandler.bind(this));
  }

  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this._titleInputElement.value);
  }
}

const projectInput = new ProjectInput();