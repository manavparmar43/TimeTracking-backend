import { BadRequest } from '@feathersjs/errors';
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import removeSqlInjection from '../../../utils/functions/removeSqlInjection';

interface Data {}

interface ServiceOptions {}

export class GetUsers implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  generateQuery(params?: Params): string[] {
    if (params?.query?.search_keyword) {
      params.query.search_keyword = removeSqlInjection(params?.query?.search_keyword);
    }
    const select = `
    SELECT
        U.id,
        U.role,
        U.first_name,
        U.middle_name,
        U.last_name,
        U.email,
        L1.value AS job, 
        L2.value AS technology
    FROM "USER" U
    LEFT JOIN "LOOKUP" L1 ON L1.id = U.job
    LEFT JOIN "LOOKUP" L2 ON L2.id = U.technology
    `;
    const and: string[] = [];
    const or: string[] = [];

    if (params?.query?.search_keyword) {
      // or.push(`word_similarity("role", '${params.query.search_keyword}') > 0.5`);
      or.push(`word_similarity("first_name", '${params.query.search_keyword}') > 0.5`);
      or.push(`word_similarity("middle_name", '${params.query.search_keyword}') > 0.5`);
      or.push(`word_similarity("last_name", '${params.query.search_keyword}') > 0.5`);
      or.push(`word_similarity("email", '${params.query.search_keyword}') > 0.5`);
      or.push(`( U.job IN (SELECT ("LOOKUP"."id") 
                    FROM "LOOKUP"
                    WHERE "label" = 'job'
                      AND (word_similarity("value", '${params.query.search_keyword}') > 0.5) 
                      AND "deleted_at" IS NULL))`);
      or.push(`( U.technology IN (SELECT ("LOOKUP"."id") 
                    FROM "LOOKUP"
                    WHERE "label" = 'technology'
                      AND (word_similarity("value", '${params.query.search_keyword}') > 0.5) 
                      AND "deleted_at" IS NULL))`);
    }
    if (params?.query?.job) {
      and.push(`U."job" = '${params?.query?.job}'`);
    }
    if (params?.query?.technology) {
      and.push(`U."technology" = '${params?.query?.technology}'`);
    }
    if (params?.query?.role) {
      and.push(`U."role" = '${params?.query?.role}'`);
    }
    if (or.length) {
      and.push(`(${or.join(' OR ')})`);
    }
    and.push('U.deleted_at IS NULL');

    let limit;
    let offset;
    if (params?.query?.$limit) {
      limit = params?.query?.$limit;
      offset = params?.query?.$skip ? params?.query?.$skip : 0;
    } else {
      limit = false;
    }

    const order = ' ORDER BY "email" ASC ';
    
    const countQuery = 'SELECT COUNT(U."id")::INTEGER FROM "USER" U WHERE ' + and.join(' AND ') + ';';
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
  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    const [countQuery, selectQuery] = this.generateQuery(params);
    const sequelize = this.app.get('sequelizeClient');
    const [count, tempCount] = await sequelize.query(countQuery);
    const [select, tempSelect] = await sequelize.query(selectQuery);
    const result = {total: count[0].count, limit:parseInt(params?.query?.$limit), skip: parseInt(params?.query?.$skip), data: select};
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
