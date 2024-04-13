import { BadRequest } from '@feathersjs/errors';
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';

interface Data {}

interface ServiceOptions {}

export class Profile implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<any> {
    throw new BadRequest('Method not allowed');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get (id: Id, params?: Params): Promise<Data> {
    const sequelize = this.app.get('sequelizeClient');
    const selectQuery = `
    SELECT u.id,
          u.role,
          u.first_name,
          u.middle_name,
          u.last_name,
          u.email,
          l1.value AS job,
          l2.value AS technology
    FROM "USER" u
    LEFT JOIN "LOOKUP" l1 ON l1.id = u.job
    LEFT JOIN "LOOKUP" l2 ON l2.id = u.technology
    WHERE u.id = '${params?.user?.id}';`;
    const [select] = await sequelize.query(selectQuery);
    const result = { data: select[0] };
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create (data: Data, params?: Params): Promise<Data> {
    throw new BadRequest('Method not allowed');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
    throw new BadRequest('Method not allowed');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    throw new BadRequest('Method not allowed');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove (id: NullableId, params?: Params): Promise<Data> {
    throw new BadRequest('Method not allowed');
  }
}
