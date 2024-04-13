// Initializes the `lookup` service on path `/lookup`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Lookup } from './lookup.class';
import createModel from '../../models/lookup.model';
import hooks from './lookup.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'lookup': Lookup & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: ['create']
  };

  // Initialize our service with any options it requires
  app.use('/lookup', new Lookup(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('lookup');

  service.hooks(hooks);
}
