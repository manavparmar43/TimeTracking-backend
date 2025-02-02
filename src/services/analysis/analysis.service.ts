// Initializes the `analysis` service on path `/analysis`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Analysis } from './analysis.class';
import hooks from './analysis.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'analysis': Analysis & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/analysis', new Analysis(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('analysis');

  service.hooks(hooks);
}
