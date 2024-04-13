import { BadRequest } from '@feathersjs/errors';
import { Id, NullableId, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';

interface Data {}

interface ServiceOptions {}

export class Widgets implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  getProjectWidget(params?: Params): string {
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
        P.name,
        SUM(AL.duration)::time as duration
    FROM "ACTIVITY_LOG" AL
    LEFT JOIN "PROJECT" P ON P.id = AL.fk_project `;

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
    
    and.push('AL."deleted_at" IS NULL');
    and.push('P."deleted_at" IS NULL');

    
    const group = ' GROUP BY P.name ';
    const order = ' ORDER BY P.name ASC ';
    
    const selectQuery =
      select +
      ' WHERE ' +
      and.join(' AND ') + group + order + ';';

    return selectQuery;
  }

  getTodoWidget(params?: Params): string {
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
        T.title,
        SUM(AL.duration)::time as duration
    FROM "ACTIVITY_LOG" AL
    LEFT JOIN "TODO" T ON T.id = AL.fk_todo `;

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
    
    and.push('AL."deleted_at" IS NULL');
    and.push('T."deleted_at" IS NULL');

    
    const group = ' GROUP BY T.title ';
    const order = ' ORDER BY T.title ASC ';
    
    const selectQuery =
      select +
      ' WHERE ' +
      and.join(' AND ') + group + order + ';';

    return selectQuery;
  }

  getDailyTimeSpentWidget(params?: Params): string {
    let userId = false;
    if (params?.user?.role === 'admin') {
      if(params?.query?.fk_user) {
        userId = params?.query?.fk_user;
      }
    } else {
      userId = params?.user?.id;
    }
    const select = `SELECT 
    ${ userId === false ? `
         U."first_name" || ' ' || U."last_name" AS "member",`: '' }
      SUM(AL.duration)::time AS duration,
      AL.date
      FROM "ACTIVITY_LOG" AL
      ${ userId === false ? ' LEFT JOIN "USER" U ON U.id = AL."fk_user"' : ''} `;


    const and = [];
    if(userId) {
      and.push(`AL."fk_user" = '${userId}'`);
    }
    if (params?.query?.start_date && params?.query?.end_date) {
      and.push(`AL."date" BETWEEN '${params?.query?.start_date}' AND '${params?.query?.end_date}'`);
    }
    
    and.push('AL."deleted_at" IS NULL');

    const group = ` GROUP BY AL.date ${ userId === false ? ', U.id' : ''} `;
    const order = ' ORDER BY AL.date ASC ';
    const selectQuery =
      select +
      ' WHERE ' +
      and.join(' AND ') + group + order + ';';

    return selectQuery;
  }

  getTimeSheetWidget(params?: Params): string {
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
      AL."id",
      ${ userId === false ? `
         U."first_name" || ' ' || U."last_name" AS "member",`: '' }
      P."name" AS "project",
      T."title" AS "todo",
      AL."date",
      AL."start_time",
      AL."end_time",
      AL."duration",
      AL."idle_time",
      ROUND((EXTRACT(EPOCH FROM ("duration" - "idle_time")) / EXTRACT(EPOCH FROM ("duration"))) * 100) AS "activity_percentage"
    FROM "ACTIVITY_LOG" AL
    ${ userId === false ? `
    LEFT JOIN "USER" U ON U.id = AL."fk_user"` : ''}
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
    
    const selectQuery =
      select +
      ' WHERE ' +
      and.join(' AND ') +
      order +
      `${limit ? 'LIMIT ' + limit + ' OFFSET ' + offset : ''}` +
      ';';

    return selectQuery;
  }

  getScreenWidget(params?: Params): string {
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
         U."first_name" || ' ' || U."last_name" AS "member",`: '' }
      AL."date",
      JSON_AGG(AL."screen_activity") AS "screen_activity"
    FROM "ACTIVITY_LOG" AL
    ${ userId === false ? `
    LEFT JOIN "USER" U ON U.id = AL."fk_user"` : ''}`;

    const and = [];
    if(userId) {
      and.push(`AL."fk_user" = '${userId}'`);
    }
    if (params?.query?.start_date && params?.query?.end_date) {
      and.push(`AL."date" BETWEEN '${params?.query?.start_date}' AND '${params?.query?.end_date}'`);
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

    const group = ` GROUP BY AL."date" ${ userId === false ? ', U.id' : ''}`;
    const order = ' ORDER BY "date" ASC ';
    
    const selectQuery =
      select +
      ' WHERE ' +
      and.join(' AND ') + group +
      order +
      `${limit ? 'LIMIT ' + limit + ' OFFSET ' + offset : ''}` +
      ';';

    return selectQuery;
  }
  
  getUrlsWidget(params?: Params): string {
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
         US."first_name" || ' ' || US."last_name" AS "member",`: '' }
      U."domain",
      U."date",
      SUM(U."duration")::time AS "duration",
      JSON_AGG(
      JSON_BUILD_OBJECT(
          'title', U."title",
          'url', U."url",
          'duration', U."duration",
          'last_visit_time', U."last_visit_time"
      )
      ) AS "urls"
    FROM "URLS" U
    ${ userId === false ? `
    LEFT JOIN "USER" US ON US.id = U."fk_user"` : ''}`;

    const and = [];
    if(userId) {
      and.push(`U."fk_user" = '${userId}'`);
    }
    if (params?.query?.start_date && params?.query?.end_date) {
      and.push(`U."date" BETWEEN '${params?.query?.start_date}' AND '${params?.query?.end_date}'`);
    }
    and.push('U."deleted_at" IS NULL');

    let limit;
    let offset;
    if (params?.query?.$limit) {
      limit = params?.query?.$limit;
      offset = params?.query?.$skip ? params?.query?.$skip : 0;
    } else {
      limit = false;
    }

    const group = ` GROUP BY U."date", U."domain" ${ userId === false ? ', US.id' : ''}`;
    const order = ' ORDER BY "domain" ASC ';
    
    const selectQuery =
      select +
      ' WHERE ' +
      and.join(' AND ') + group +
      order +
      `${limit ? 'LIMIT ' + limit + ' OFFSET ' + offset : ''}` +
      ';';

    return selectQuery;
  }
  
  getTimeSpentByProjectWidget(params?: Params): string {
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
      P.name,
      P.estimated_hours,
      SUM(AL.DURATION)::time as time_spent_by_member,
      U."first_name" || ' ' || U."last_name" AS "member"
    FROM "ACTIVITY_LOG" AL
    LEFT JOIN "PROJECT" P ON P.id = AL.fk_project
    LEFT JOIN "USER" U ON U.ID = AL."fk_user"`;

    const and = [];
    if(userId) {
      and.push(`AL.fk_user = '${userId}'`);
    }
    if(params?.query?.fk_project) {
      and.push(`AL.fk_project = '${params?.query?.fk_project}'`);
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

    const group = ' GROUP BY U.ID, P.id ';
    const order = ' ORDER BY P."name" ASC ';
    
    const selectQuery =
      select +
      ' WHERE ' +
      and.join(' AND ') + group +
      order +
      `${limit ? 'LIMIT ' + limit + ' OFFSET ' + offset : ''}` +
      ';';

    return selectQuery;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<any> {
    let selectQuery = '';
    switch(params?.query?.widget_name) {
    case 'project':
      selectQuery = this.getProjectWidget(params);
      break;
    case 'todo':
      selectQuery = this.getTodoWidget(params);
      break;
    case 'day':
      selectQuery = this.getDailyTimeSpentWidget(params);
      break;
    case 'timesheet':
      selectQuery = this.getTimeSheetWidget(params);
      break;
    case 'screen':
      selectQuery = this.getScreenWidget(params);
      break;
    case 'urls':
      selectQuery = this.getUrlsWidget(params);
      break;
    case 'time_spent':
      selectQuery = this.getTimeSpentByProjectWidget(params);
      break;
    default:
      break;
    }
    const sequelize = this.app.get('sequelizeClient');
    // const [count, tempCount] = await sequelize.query(countQuery);
    const [select, tempSelect] = await sequelize.query(selectQuery);
    const result = { data: select };
    return result;
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
