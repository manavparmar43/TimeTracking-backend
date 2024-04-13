// Initializes the `screenshot` service on path `/screenshot`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Screenshot } from './screenshot.class';
import createModel from '../../models/screenshot.model';
import hooks from './screenshot.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'screenshot': Screenshot & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/screenshot', new Screenshot(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('screenshot');

  service.hooks(hooks);
}
