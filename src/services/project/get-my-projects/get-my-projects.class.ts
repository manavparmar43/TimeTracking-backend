import { BadRequest } from '@feathersjs/errors';
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';

interface Data {}

interface ServiceOptions {}

export class GetMyProjects implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    const userId = params?.user?.id;

    // Return early if the user ID is not available
    if (!userId) {
      throw new Error('User ID is missing from context params');
    }
    const sequelize = this.app.get('sequelizeClient');
    let query;
    if(params?.query?.dashboard && params?.query?.dashboard === 'true') {
      query = `
      SELECT 
        P."name",
        P."id",
        (SELECT SUM("duration")
          FROM "ACTIVITY_LOG"
          WHERE "fk_user" = '${userId}'
              AND "fk_project" = P.ID
              AND "date" = CURRENT_DATE)::time AS "duration",
            JSON_AGG(JSON_BUILD_OBJECT('name',
  
                        T."title",
                        'duration',
                                          (SELECT SUM("duration")
                                            FROM "ACTIVITY_LOG"
                                            WHERE "fk_user" = '${userId}'
                                                AND "fk_todo" = T.ID
                                                AND "date" = CURRENT_DATE))) AS "todo"
      FROM "PROJECT" P
      INNER JOIN "PROJECT_MEMBER" PM ON P.ID = PM."fk_project" AND PM."fk_user" = '${userId}'
      LEFT JOIN "TODO" T ON P.ID = T."fk_project" AND T."fk_user" = '${userId}' AND T."is_completed" = FALSE
      WHERE P."deleted_at" IS NULL AND
            PM."deleted_at" IS NULL
      GROUP BY P."name",
            P."id";
      `;
    } else {
      query = `
      SELECT 
        P."name", 
        P."id"
      FROM "PROJECT" P 
      LEFT JOIN "PROJECT_MEMBER" PM ON P.id = PM."fk_project" 
      WHERE 
        PM."fk_user" = '${userId}' AND 
        P."deleted_at" IS NULL AND 
        PM."deleted_at" IS NULL
      `;
    }
    const [select, tempSelect] = await sequelize.query(query);
    
    return select;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get (id: Id, params?: Params): Promise<Data> {
    throw new BadRequest('Method not allowed');
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
