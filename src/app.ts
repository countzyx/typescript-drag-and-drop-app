import { ProjectInput } from './components/project-input';
import { ProjectList } from './components/project-list';
import { ProjectState } from './models/project-state';

const projectState = ProjectState.getInstance();
new ProjectInput(projectState);
new ProjectList('active', projectState);
new ProjectList('finished', projectState);
