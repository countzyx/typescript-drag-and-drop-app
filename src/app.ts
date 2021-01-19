class ProjectInput {
  private _templateElement: HTMLTemplateElement;
  private _hostElement: HTMLDivElement;
  private _formElement: HTMLFormElement;

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
    this.attach();
  }

  private attach() {
    this._hostElement.insertAdjacentElement('afterbegin', this._formElement);
  }
}

const projectInput = new ProjectInput();