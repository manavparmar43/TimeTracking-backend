// Initializes the `client` service on path `/client`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Client } from './client.class';
import createModel from '../../models/client.model';
import hooks from './client.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'client': Client & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/client', new Client(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('client');

  service.hooks(hooks);
}
