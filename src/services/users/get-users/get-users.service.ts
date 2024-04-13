// Initializes the `users/get-users` service on path `/users/get-users`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { GetUsers } from './get-users.class';
import hooks from './get-users.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'users/get-users': GetUsers & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/users/get-users', new GetUsers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('users/get-users');

  service.hooks(hooks);
}
