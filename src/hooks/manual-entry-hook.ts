import { HookContext } from '@feathersjs/feathers';

export default (options = {}) => {
  return async (context: HookContext): Promise<boolean> => {
    if (context.data.fk_user != null && context.data.is_manual === 'true') {
      delete context.data.is_manual;
      return false;
    }
    return true;
  };
};
