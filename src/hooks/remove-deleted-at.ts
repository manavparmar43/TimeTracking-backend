// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import Debug from 'debug';
const debug = Debug('feathers:app:RemoveDeletedHook');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { params } = context;
    context.params.query = {
      ...params.query,
      deleted_at: null,
    };
    debug(
      `Provider:: ${params.provider} :: ${context.path} :: ${context.method} :: ${context.type}`
    );
    return context;
  };
};
