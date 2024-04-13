import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { BadRequest } from '@feathersjs/errors';

interface Data {}

interface ServiceOptions {}

export class Download implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  generateQuery(params?: Params): string[] {
    let userId = false;
    if (params?.user?.role === 'admin') {
      if(params?.query?.fk_user) {
        userId = params?.query?.fk_user;
      }
    } else {
      userId = params?.user?.id;
    }

    const select = `
    SELECT
      ${ userId === false ? `
         U."first_name" || ' ' || U."last_name" AS "member",
         U."email",
         L1."value" AS "job",
         L2."value" AS "technology",`: '' }
      P."name" AS "project",
      T."title" AS "todo",
      AL."date",
      (SELECT CASE
                  WHEN EXTRACT(DAY FROM AL."date") < 8 THEN 1
                  ELSE CASE
                          WHEN EXTRACT(DAY FROM AL."date") < 15 THEN 2
                          ELSE CASE
                                WHEN EXTRACT(DAY FROM AL."date") < 22 THEN 3
                                ELSE CASE
                                        WHEN EXTRACT(DAY FROM AL."date") < 29 THEN 4
                                        ELSE 5
                                    END
                            END
                  END
              END)::int AS "week",
      AL."start_time",
      AL."end_time",
      AL."duration",
      AL."idle_time",
      ROUND((EXTRACT(EPOCH FROM ("duration" - "idle_time")) / EXTRACT(EPOCH FROM ("duration"))) * 100) || '%' AS "activity_percentage"
    FROM "ACTIVITY_LOG" AL
    ${ userId === false ? `
    LEFT JOIN "USER" U ON U.id = AL."fk_user"
    LEFT JOIN "LOOKUP" L1 ON L1.id = U."job"
    LEFT JOIN "LOOKUP" L2 ON L2.id = U."technology"` : ''}
    LEFT JOIN "PROJECT" P ON P.id = AL."fk_project"
    LEFT JOIN "TODO" T ON T.id = AL."fk_todo"`;

    const and = [];
    if(userId) {
      and.push(`AL."fk_user" = '${userId}'`);
    }
    if (params?.query?.start_date && params?.query?.end_date) {
      and.push(`AL."date" BETWEEN '${params?.query?.start_date}' AND '${params?.query?.end_date}'`);
    }
    if (params?.query?.fk_project) {
      and.push(`AL."fk_project" = '${params?.query?.fk_project}'`);
    }
    if (params?.query?.min_activity_percentage) {
      and.push(`ROUND((EXTRACT(EPOCH FROM ("duration" - "idle_time")) / EXTRACT(EPOCH FROM ("duration"))) * 100) >= ${params?.query?.min_activity_percentage}`);
    }
    and.push('AL."deleted_at" IS NULL');

    let limit;
    let offset;
    if (params?.query?.$limit) {
      limit = params?.query?.$limit;
      offset = params?.query?.$skip ? params?.query?.$skip : 0;
    } else {
      limit = false;
    }

    const order = ' ORDER BY "date", "start_time" ASC ';
    
    const countQuery = 'SELECT COUNT(AL."id")::INTEGER FROM "ACTIVITY_LOG" AL WHERE ' + and.join(' AND ') + ';';
    const selectQuery =
      select +
      ' WHERE ' +
      and.join(' AND ') +
      order +
      `${limit ? 'LIMIT ' + limit + ' OFFSET ' + offset : ''}` +
      ';';

    return [countQuery, selectQuery];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<any> {
    const [countQuery, selectQuery] = this.generateQuery(params);
    const sequelize = this.app.get('sequelizeClient');
    // const [count, tempCount] = await sequelize.query(countQuery);
    const [select, tempSelect] = await sequelize.query(selectQuery);

    const csvWriter = createCsvWriter({
      path: 'public/result.csv',
      header: [
        {id: 'member', title: 'Member'},
        {id: 'email', title: 'Email'},
        {id: 'job', title: 'Job'},
        {id: 'technology', title: 'Technology'},
        {id: 'project', title: 'Project'},
        {id: 'todo', title: 'Todo'},
        {id: 'date', title: 'Date'},
        {id: 'week', title: 'Week'},
        {id: 'start_time', title: 'Start Time'},
        {id: 'end_time', title: 'End Time'},
        {id: 'duration', title: 'Duration'},
        {id: 'idle_time', title: 'Idle Time'},
        {id: 'activity_percentage', title: 'Activity Percentage'},
        {id: 'notes', title: 'Notes'}
      ]
    });
    
    csvWriter.writeRecords(select).then(() => console.log('The CSV file was written successfully'));
    const data = {
      message: 'CSV Created',
      data: [`http://${ this.app.get('host')}:${this.app.get('port')}/result.csv`]
    };
    return data;
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
    return { id };
  }
}
