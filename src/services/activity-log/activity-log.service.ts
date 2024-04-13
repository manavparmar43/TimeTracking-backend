// Initializes the `activity-log` service on path `/activity-log`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ActivityLog } from './activity-log.class';
import createModel from '../../models/activity-log.model';
import hooks from './activity-log.hooks';
import { responseFile } from '../../middleware/response';
import uploadScreenshots from '../../middleware/upload-screenshots';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'activity-log': ActivityLog & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/activity-log', uploadScreenshots.array('screenshots') , responseFile, new ActivityLog(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('activity-log');

  service.hooks(hooks);
}
