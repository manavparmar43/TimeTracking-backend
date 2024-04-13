// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    let createdRecords = 0;
    let updatedRecords = 0;

    const promises: Promise<void>[] = context.data.map(async (data: any) => {
      const [record, created]: [any, boolean] = await context.app
        .service('urls')
        .Model.findOrCreate({
          where: { fk_user: context?.params?.user?.id ,date: data.date, domain: data.domain, url: data.url, browser: data.browser, deleted_at: null },
          defaults: {...data, fk_user: context?.params?.user?.id, created_at_ip: context.data.created_at_ip},
        });
      if (!created) {
        await context.app.service('urls')._patch(record.id, {...data, updated_at_ip: context.data.created_at_ip});
        updatedRecords += 1;
      } else {
        createdRecords += 1;
      }
    });

    try {
      await Promise.all(promises);
      context.result = {
        status: 1,
        message: `${createdRecords} Records Created. ${updatedRecords} Records Updated.`,
        data: context.data,
      };
    } catch (error: any) {
      context.result = {
        status: 0,
        message: error?.message || 'Something went wrong!',
        data: context.data,
      };
    }

    return context;
  };
};
