import { Hook, HookContext } from '@feathersjs/feathers';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { params } = context;
    if (
      params.query != null &&
      params.query.$limit != null &&
      params.query.$limit === '-1'
    ) {
      delete params.query.$limit;
      params.paginate = false;
    }
    if (params.query != null && params.query.$sort == null) {
      context.params.query = {
        ...context.params.query,
        $sort: {
          id: 1,
        },
      };
    }
    return context;
  };
};
