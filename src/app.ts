import { ProjectInput } from './components/project-input.js';
import { ProjectList } from './components/project-list.js';
import { ProjectState } from './models/project-state.js';

const projectState = ProjectState.getInstance();
new ProjectInput(projectState);
new ProjectList('active', projectState);
new ProjectList('finished', projectState);
