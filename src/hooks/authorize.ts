// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (role = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    if(context?.params?.user?.role !== role) {
      context.result = {
        message: 'Not Authorized',
      };
    }
    return context;
  };
};
