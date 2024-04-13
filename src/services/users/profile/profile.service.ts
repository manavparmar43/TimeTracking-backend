// Initializes the `users/profile` service on path `/users/profile`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Profile } from './profile.class';
import hooks from './profile.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'users/profile': Profile & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/users/profile', new Profile(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('users/profile');

  service.hooks(hooks);
}
