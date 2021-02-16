/// <reference path="components/project-input.ts" />
/// <reference path="components/project-list.ts" />

namespace App {
  new ProjectInput(projectState);
  new ProjectList('active', projectState);
  new ProjectList('finished', projectState);
}
