// Component
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  protected templateElement: HTMLTemplateElement;
  protected hostElement: T;
  protected componentElement: U;

  constructor(templateId: string, hostId: string) {
    this.templateElement = document.getElementById(templateId) as HTMLTemplateElement;
    if (!this.templateElement) {
      throw Error(`No template element named "${templateId}" defined on the page.`);
    }

    this.hostElement = document.getElementById(hostId) as T;
    if (!this.hostElement) {
      throw Error(`No host element named "${hostId}" defined on the page.`);
    }

    const importedNode = document.importNode(this.templateElement.content, true);
    this.componentElement = importedNode.firstElementChild as U;
    if (!this.componentElement) {
      throw Error(`No ${typeof this.componentElement} inside the ${templateId} template.`);
    }
  }

  protected abstract renderContent(): void;
}
