// Initializes the `project member` service on path `/project-member`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ProjectMember } from './project-member.class';
import createModel from '../../models/project-member.model';
import hooks from './project-member.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'project-member': ProjectMember & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: [ 'create' ]
  };

  // Initialize our service with any options it requires
  app.use('/project-member', new ProjectMember(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('project-member');

  service.hooks(hooks);
}
