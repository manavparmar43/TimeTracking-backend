// Initializes the `widgets` service on path `/widgets`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Widgets } from './widgets.class';
import hooks from './widgets.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'widgets': Widgets & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/widgets', new Widgets(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('widgets');

  service.hooks(hooks);
}
