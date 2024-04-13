// Initializes the `todo` service on path `/todo`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Todo } from './todo.class';
import createModel from '../../models/todo.model';
import hooks from './todo.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'todo': Todo & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/todo', new Todo(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('todo');

  service.hooks(hooks);
}
