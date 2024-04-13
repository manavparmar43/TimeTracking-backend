// Initializes the `project/get-my-projects` service on path `/project/get-my-projects`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { GetMyProjects } from './get-my-projects.class';
import hooks from './get-my-projects.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'project/get-my-projects': GetMyProjects & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/project/get-my-projects', new GetMyProjects(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('project/get-my-projects');

  service.hooks(hooks);
}
